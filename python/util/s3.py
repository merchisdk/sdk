import itertools
import mimetypes
import io
import requests
from boto.s3.connection import S3Connection

URL_TTL = 14400  # (seconds = 4 hours)
BUFFER_FLUSH = 10485760  # flush to network if have > 10 MiB


class S3UploadStream(object):

    def __init__(self, bucket, file_row):
        self.bucket = bucket
        self.file_row = file_row
        file_row.size = 0
        headers = {}
        if file_row.name and not file_row.mimetype:
            file_row.mimetype = mimetypes.guess_type(file_row.name)[0]
        if not file_row.mimetype:
            file_row.mimetype = 'application/octet-stream'
        headers['Content-Type'] = file_row.mimetype
        self.mp = self.bucket.initiate_multipart_upload(file_row.upload_id,
                                                        headers=headers)
        self.index = 1
        self.data = []

    def write(self, data):
        self.data.append(data)
        if len(self.data) > BUFFER_FLUSH:
            self._flush_buffer()

    def _flush_buffer(self):
        with io.BytesIO(self.data) as chunk:
            self.mp.upload_part_from_file(chunk, part_num=self.index)
            self.file_row.size += len(self.data)
        self.index += 1
        self.data = []

    def close(self):
        self.mp.complete_upload()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class S3Bucket(object):

    def __init__(self, access_key, secret_key, bucket_name):
        self.access_key = access_key
        self.secret_key = secret_key
        # contrary to the documentation, the smallest chunk size that S3 allows,
        # other than for the last chunk, is 5MiB, not 5MB
        self.chunk_size = 5242880
        self.bucket_name = bucket_name
        self.s3_connection = S3Connection(self.access_key,
                                          self.secret_key)
        self.bucket = self.s3_connection.get_bucket(self.bucket_name)

    def upload_file(self, key, data, mimetype=None, filename=None,
                    with_retries=1):
        """ Upload a file to this S3 bucket.

            Args:
              key (str): index to store this file under. will overwrite old.
              data: May be a file or file-like object or an str or bytestring
              mimetype: mimetype metadata to store with the file
              filename: if mimetype not provided, it may be guesed from name
              with_retries: number of times to retry in the face of errors
        """
        for i in range(0, with_retries):
            try:
                return self._upload_file(key, data, mimetype=mimetype,
                                         filename=filename)
            except Exception as e:
                if i < with_retries:
                    continue
                raise e

    def _upload_file(self, key, data, mimetype=None, filename=None):
        key = str(key)
        headers = {}
        if filename and not mimetype:
            mimetype = mimetypes.guess_type(filename)[0]
        if not mimetype:
            mimetype = 'application/octet-stream'
        headers['Content-Type'] = mimetype
        mp = self.bucket.initiate_multipart_upload(key, headers=headers)
        total_size = 0
        try:
            if not hasattr(data, 'read'):
                data = io.BytesIO(data)
            for index in itertools.count(1, step=1):
                chunk = data.read(self.chunk_size)
                if not chunk:
                    break
                chunk_length = len(chunk)
                with io.BytesIO(chunk) as chunk:
                    mp.upload_part_from_file(chunk, part_num=index)
                    total_size += chunk_length
            mp.complete_upload()
        except Exception as e:
            mp.cancel_upload()
            raise e
        return total_size

    def upload_stream(self, file_row):
        return S3UploadStream(self.bucket, file_row)

    def get_key(self, key):
        """ Retreive information about the given key in this bucket.

            Args:
              key (str): Will be converted to str

            Returns: boto.s3.key

            Raises:
              KeyError: if no such key in bucket
        """
        key_str = str(key)
        key = self.bucket.get_key(key_str)
        if not key:
            raise KeyError("No file with key: " + key_str)
        return key

    def fetch_file(self, key):
        """ Retrieve file data from S3.

            Args:
              key (str): designates the file to fetch

            Returns: io.BytesIO

            Raises:
              KeyError: if no such key in bucket
        """
        key = self.get_key(key)
        data = key.get_contents_as_string()
        return io.BytesIO(data)

    def fetch_file_by_url(self, url):
        """ Retrieve file data from S3 base on the entire url that given.

            Args:
              url (str): the url designates the file to fetch

            Returns: io.BytesIO
        """
        return io.BytesIO(requests.get(url).text.encode())

    def fetch_view_url(self, key):
        """ Produce a URL at which the file named by the given key is served
            over HTTP. Link is only valid for URL_TTL.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        key = self.get_key(key)
        return key.generate_url(URL_TTL, expires_in_absolute=False)

    def fetch_download_url(self, key, file_name):
        """ Produce a URL at which the file named by the given key is served
            over HTTP as an attachment. Link is only valid for URL_TTL.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        headers = {}
        if file_name:
            value = 'attachment; filename="{0}"'.format(file_name)
            headers['response-content-disposition'] = value
        return self.s3_connection.generate_url(URL_TTL, 'GET',
                                               bucket=self.bucket_name,
                                               key=key,
                                               expires_in_absolute=False,
                                               query_auth=True,
                                               response_headers=headers)

    def delete_file(self, key):
        """ Delete file from bucket.

            Args:
              key (str): designates the file to serve

            Raises:
              KeyError: if no such key in bucket
        """
        key = self.get_key(key)
        key.delete()

    def all_keys(self):
        """ Generator that yields every key in the bucket """
        for key in self.bucket.list():
            yield key.name
