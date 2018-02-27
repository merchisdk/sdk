import io
import os
from sdk.python.util.brand_util import colour_logo_uri
from typing import Dict  # noqa  # pylint: disable=unused-import


local_domain_logo_uri = "file://" + os.path.\
    abspath(os.path.join(os.path.dirname(__file__),
                         '..', colour_logo_uri))


class TemporaryUploadStream(object):

    def __init__(self, bucket, file_row):
        self.bucket = bucket
        self.file_row = file_row
        file_row.size = 0
        self.data = b''

    def write(self, data):
        self.data += data
        self.file_row.size += len(data)

    def close(self):
        self.bucket.storage[self.file_row.upload_id] = io.BytesIO(self.data)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class TemporyBucket(object):
    """ A mockup filestore for use in testing only. Mimics the interface of
        the S3Bucket class in s3.py. Stores file data in an in memory dict.
        Fakes file URLs, doesn't actually serve files.
    """

    BUCKET_DOMAIN = "/testfiles/"

    def __init__(self, access_key, secret_key, bucket_name):
        self.storage = {}  # type: Dict[str, io.BytesIO]

    def upload_file(self, key, data, mimetype=None, filename=None,
                    with_retries=1):
        """ Upload a file to this TemporyBucket.

            Args:
              key (str): index to store this file under. will overwrite old.
              data: May be a file or file-like object or an str or bytestring
              mimetype: mimetype metadata to store with the file
              filename: if mimetype not provided, it may be guesed from name
        """
        error = RuntimeError("could not temporarily store")  # type: Exception
        for _ in range(0, with_retries):
            try:
                return self._upload_file(key, data, mimetype=mimetype,
                                         filename=filename)
            except Exception as e:
                error = e
        raise error

    def _upload_file(self, key, data, mimetype=None, filename=None):
        key = str(key)
        if hasattr(data, 'read'):
            data = data.read()
        self.storage[key] = io.BytesIO(data)
        return len(data)

    def upload_stream(self, file_row):
        return TemporaryUploadStream(self, file_row)

    def fetch_file_by_url(self, url):
        """ Download a file from this TemporyBucket the file that be downloaded
            will wraped in a BytesIO to better simulate the real world scenario.

            Returns: io.BytesIO

            Args:
              url (str): a url will be used to download the file
        """
        if not url.startswith(self.BUCKET_DOMAIN):
            raise NotImplementedError()
        domain_length = len(self.BUCKET_DOMAIN)
        key = url[domain_length:]
        return self.fetch_file(key)

    def get_key(self, key):
        if key not in self.storage:
            raise KeyError("no such key")
        raise NotImplementedError()

    def fetch_file(self, key):
        """ Retrieve file data from S3.

            Args:
              key (str): designates the file to fetch

            Returns: io.BytesIO

            Raises:
              KeyError: if no such key in bucket
        """
        # before send ensure the file pointer of the io is
        # at the beginning
        self.storage[key].seek(0)
        return io.BytesIO(self.storage[key].read())

    def fetch_view_url(self, key):
        """ Produce a fake URL at which the file named by the given key is
            served over HTTP.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        if key not in self.storage:
            raise KeyError("no such key")
        # send domain logo uri of local machine as a sample img resource
        # for test purpose
        return self.BUCKET_DOMAIN + key

    def fetch_download_url(self, key, file_name):
        """ Produce a fake URL at which the file named by the given key is
            served over HTTP as an attachment.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        if key not in self.storage:
            raise KeyError("no such key")
        # send domain logo uri of local machine as a sample img resource
        # for test purpose
        return self.BUCKET_DOMAIN + key

    def delete_file(self, key):
        """ Delete file from bucket.

            Args:
              key (str): designates the file to serve

            Raises:
              KeyError: if no such key in bucket
        """
        if key not in self.storage:
            raise KeyError("no such key")
        del self.storage[key]

    def all_keys(self):
        """ Generator that yields every key in the bucket """
        for key in self.storage:
            yield key
