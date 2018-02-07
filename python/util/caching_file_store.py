from typing import Dict  # noqa # pylint: disable=unused-import
import io
import os
from sdk.python.util.s3 import S3Bucket
from sdk.python.util.brand_util import colour_logo_uri


local_domain_logo_uri = "file://" + os.path.\
    abspath(os.path.join(os.path.dirname(__file__),
                         '..', colour_logo_uri))


class CachingBucket(object):
    """ A filestore that additionally caches all uploads to memory. Mimics
        the interface of the S3Bucket class in s3.py, and also uses that to
        store items persistently. Never evicts any entries from the cache --
        the idea is that it can be used by a tempory process which may freely
        leak memory.
    """

    def __init__(self, access_key, secret_key, bucket_name,
                 underlying_bucket=S3Bucket):
        self.storage = {}  # type: Dict[str, io.BytesIO]
        self.underlying_storage = \
            underlying_bucket(access_key, secret_key, bucket_name)

    def upload_file(self, key, data, mimetype=None, filename=None,
                    with_retries=1):
        """ Upload a file to this TemporyBucket.

            Args:
              key (str): index to store this file under. will overwrite old.
              data: May be a file or file-like object or an str or bytestring
              mimetype: mimetype metadata to store with the file
              filename: if mimetype not provided, it may be guesed from name
        """
        self.underlying_storage.upload_file(key, data, mimetype=mimetype,
                                            filename=filename)
        # add also to in memory cache
        key = str(key)
        if hasattr(data, 'read'):
            data = data.read()
        self.storage[key] = io.BytesIO(data)
        return len(data)

    def fetch_file_by_url(self, url):
        """ Download a file from this TemporyBucket the file that be downloaded
            will wraped in a BytesIO to better simulate the real world scenario.

            Returns: io.BytesIO

            Args:
              url (str): a url will be used to download the file
        """
        return self.underlying_storage.fetch_file_by_url(url)

    def get_key(self, key):
        return self.underlying_storage.get_key(key)

    def fetch_file(self, key):
        """ Retrieve file data from S3.

            Args:
              key (str): designates the file to fetch

            Returns: io.BytesIO

            Raises:
              KeyError: if no such key in bucket
        """
        if key in self.storage:
            self.storage[key].seek(0)
            return io.BytesIO(self.storage[key].read())
        return self.underlying_storage.fetch_file(key)

    def fetch_view_url(self, key):
        """ Produce a fake URL at which the file named by the given key is
            served over HTTP.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        return self.underlying_storage.fetch_view_url(key)

    def fetch_download_url(self, key, file_name):
        """ Produce a fake URL at which the file named by the given key is
            served over HTTP as an attachment.

            Args:
              key (str): designates the file to serve

            Returns: str

            Raises:
              KeyError: if no such key in bucket
        """
        return self.underlying_storage.fetch_download_url(key, file_name)

    def delete_file(self, key):
        """ Delete file from bucket.

            Args:
              key (str): designates the file to serve

            Raises:
              KeyError: if no such key in bucket
        """
        if key in self.storage:
            del self.storage[key]
        return self.underlying_storage.delete_file(key)

    def all_keys(self):
        """ Generator that yields every key in the bucket """
        for key in self.storage:
            yield key
