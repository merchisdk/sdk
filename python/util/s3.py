import itertools
import mimetypes
import io
import requests
import boto3

URL_TTL = 14400  # (seconds = 4 hours)
BUFFER_FLUSH = 10485760  # flush to network if have > 10 MiB


class S3UploadStream(object):

    def __init__(self, s3, bucket_name, file_row):
        self.s3 = s3
        self.bucket_name = bucket_name
        self.file_row = file_row
        file_row.size = 0
        if file_row.name and not file_row.mimetype:
            file_row.mimetype = mimetypes.guess_type(file_row.name)[0]
        if not file_row.mimetype:
            file_row.mimetype = 'application/octet-stream'
        mtype = file_row.mimetype
        client = s3.meta.client
        self.mp = client.create_multipart_upload(Bucket=bucket_name,
                                                 Key=file_row.upload_id,
                                                 ContentType=mtype)
        self.index = 1
        self.data = []  # type: ignore
        self.parts = []  # type: ignore

    def write(self, data):
        self.data.append(data)
        if len(self.data) > BUFFER_FLUSH:
            self._flush_buffer()

    def _flush_buffer(self):
        part = self.s3.upload_part(Bucket=self.bucket_name,
                                   Key=self.file_row.upload_id,
                                   PartNumber=self.index,
                                   UploadId=self.mp['UploadId'],
                                   Body=self.data)
        self.file_row.size += len(self.data)
        self.parts.append({'PartNumber': self.index,
                           'ETag': part['ETag']})

        self.index += 1
        self.data = []

    def close(self):
        args = {'Bucket': self.bucket_name,
                'Key': self.file_row.upload_id,
                'UploadId': self.mp['UploadId'],
                'MultipartUpload': {'Parts': self.parts}}
        self.s3.meta.client.complete_multipart_upload(**args)

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
        self.session = boto3.Session(aws_access_key_id=access_key,
                                     aws_secret_access_key=secret_key)
        self.s3 = self.session.resource('s3')
        self.bucket = self.s3.Bucket(bucket_name)
        self.bucket_name = bucket_name
        self.client = self.s3.meta.client

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
        error = RuntimeError("failed to upload to s3")  # type: Exception
        for _ in range(0, with_retries):
            try:
                return self._upload_file(key, data, mimetype=mimetype,
                                         filename=filename)
            except Exception as e:  # pylint: disable=broad-except
                error = e
        raise error

    def _upload_file(self, key, data, mimetype=None, filename=None):
        key = str(key)
        if not hasattr(data, 'read'):
            data = io.BytesIO(data)
        if filename and not mimetype:
            mimetype = mimetypes.guess_type(filename)[0]
        if not mimetype:
            mimetype = 'application/octet-stream'
        args = {'ContentType': mimetype}
        self.bucket.upload_fileobj(data, key, ExtraArgs=args)
        return self.client.head_object(Bucket=self.bucket_name,
                                       Key=key)['ContentLength']

    def upload_stream(self, file_row):
        return S3UploadStream(self.s3, self.bucket_name, file_row)

    def fetch_file(self, key):
        """ Retrieve file data from S3.

            Args:
              key (str): designates the file to fetch

            Returns: io.BytesIO

            Raises:
              KeyError: if no such key in bucket
        """
        return self.s3.Object(self.bucket_name, key).get()['Body']

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
        params = {'Bucket': self.bucket_name,
                  'Key': key}
        return self.client.generate_presigned_url('get_object',
                                                  Params=params,
                                                  ExpiresIn = URL_TTL)

    def fetch_download_url(self, key, file_name):
        """ Produce a URL at which the file named by the given key is served
            over HTTP as an attachment. Link is only valid for URL_TTL.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        params = {'Bucket': self.bucket_name,
                  'Key': key}
        if file_name:
            value = 'attachment; filename="{0}"'.format(file_name)
            params['ResponseContentDisposition'] = value
        return self.client.generate_presigned_url('get_object', Params=params,
                                                  ExpiresIn = URL_TTL)

    def delete_file(self, key):
        """ Delete file from bucket.

            Args:
              key (str): designates the file to serve

            Raises:
              KeyError: if no such key in bucket
        """
        self.client.delete_object(Bucket=self.bucket_name,
                                  Key=key)

    def all_keys(self):
        """ Generator that yields every key in the bucket """
        objects = self.client.list_objects(Bucket=self.bucket_name)
        for key in objects['Contents']:
            yield key['Key']
