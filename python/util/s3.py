import mimetypes
import io
import os
import requests
import boto3
import s3fs

from botocore.config import Config

URL_TTL = 604800  # (seconds = 7 days)


def _int_env(name, default):
    try:
        return int(os.environ.get(name, default))
    except (TypeError, ValueError):
        return default


def _bool_env(name, default):
    val = os.environ.get(name)
    if val is None:
        return default
    return val.strip().lower() not in ("0", "false", "no", "off")


def _default_use_accelerate():
    """Transfer acceleration often times out on local dev / VPN; use regional S3."""
    mode = os.environ.get("MODE", "").strip().lower()
    if mode == "development":
        return False
    return True


def _is_connect_timeout(exc):
    """True when botocore/urllib3 could not reach the S3 endpoint."""
    name = type(exc).__name__
    if name in ("ConnectTimeoutError", "ConnectTimeout", "EndpointConnectionError"):
        return True
    msg = str(exc).lower()
    return "connect timeout" in msg or "connection timed out" in msg


class S3Bucket(object):

    def __init__(self, access_key, secret_key, bucket_name):
        self.access_key = access_key
        self.secret_key = secret_key
        self.bucket_name = bucket_name
        # contrary to the documentation, the smallest chunk size that S3 allows,
        # other than for the last chunk, is 5MiB, not 5MB
        self.chunk_size = 5242880
        self.use_accelerate = _bool_env(
            "AWS_S3_USE_ACCELERATE", _default_use_accelerate()
        )
        self._init_clients()

    def _make_config(self):
        # Bound how long an upload/download can stall. Without explicit socket
        # timeouts, a transient network blip (common on local dev / VPN, esp.
        # with the transfer-acceleration CloudFront edge) makes botocore wait up
        # to 60s per attempt and retry up to max_attempts times — effectively an
        # indefinite hang that ties up a worker. All four are env-tunable so prod
        # can keep aggressive retries while local dev fails fast (or disables
        # acceleration). Defaults bound the worst case while staying generous.
        return Config(
            s3={"use_accelerate_endpoint": self.use_accelerate},
            retries={
                "max_attempts": _int_env("AWS_S3_MAX_ATTEMPTS", 10),
                "mode": "standard",
            },
            connect_timeout=_int_env("AWS_S3_CONNECT_TIMEOUT", 10),
            read_timeout=_int_env("AWS_S3_READ_TIMEOUT", 60),
        )

    def _init_clients(self):
        config = self._make_config()
        self.session = boto3.Session(
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
        )
        self.s3 = self.session.resource("s3", config=config)
        self.bucket = self.s3.Bucket(self.bucket_name)
        self.client = self.s3.meta.client

    def _disable_accelerate(self):
        if not self.use_accelerate:
            return False
        self.use_accelerate = False
        self._init_clients()
        return True

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
        tried_accelerate_fallback = False
        for _ in range(0, with_retries):
            try:
                return self._upload_file(key, data, mimetype=mimetype,
                                         filename=filename)
            except Exception as e:  # pylint: disable=broad-except
                error = e
                if (
                    not tried_accelerate_fallback
                    and self.use_accelerate
                    and _is_connect_timeout(e)
                    and self._disable_accelerate()
                ):
                    tried_accelerate_fallback = True
                    continue
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
        fs = s3fs.S3FileSystem(anon=False, key=self.access_key,
                               secret=self.secret_key)
        object_name = '{}/{}'.format(self.bucket_name, file_row.id)
        return fs.open(object_name, 'wb')

    def fetch_file(self, key):
        """ Retrieve file data from S3.

            Args:
              key (str): designates the file to fetch

            Returns: io.BytesIO

            Raises:
              KeyError: if no such key in bucket
        """
        try:
            return self.s3.Object(self.bucket_name, key).get()['Body']
        except self.client.exceptions.NoSuchKey:
            raise KeyError

    def fetch_file_by_url(self, url):
        """ Retrieve file data from S3 base on the entire url that given.

            Args:
              url (str): the url designates the file to fetch

            Returns: io.BytesIO
        """
        return io.BytesIO(requests.get(url).text.encode())

    def fetch_view_url(self, key):
        """ Generate a public URL for an object in an S3 bucket.
            :return: str, the public URL to access the S3 object
        """
        if self.use_accelerate:
            return f"https://{self.bucket_name}.s3-accelerate.amazonaws.com/{key}"
        region = getattr(self.client.meta, "region_name", None) or "us-east-1"
        if region == "us-east-1":
            return f"https://{self.bucket_name}.s3.amazonaws.com/{key}"
        return f"https://{self.bucket_name}.s3.{region}.amazonaws.com/{key}"

    def fetch_download_url(self, key, file_name):
        """ Generate a public download URL for an object in an S3 bucket.
            :return: str, the public URL to access the S3 object
        """
        params = {'Bucket': self.bucket_name, 'Key': key}
        if file_name:
            value = 'attachment; filename="{0}"'.format(file_name)
            params['ResponseContentDisposition'] = value
        return self.client.generate_presigned_url(
            'get_object', Params=params, ExpiresIn=URL_TTL)

    def delete_file(self, key):
        """ Delete file from bucket.

            Args:
              key (str): designates the file to serve

            Raises:
              KeyError: if no such key in bucket
        """
        self.client.delete_object(Bucket=self.bucket_name,
                                  Key=key)

    def copy_file(self, old_key, new_key):
        """ Copy a file within the same bucket.

            Args:
              old_key (str): original file key
              new_key (str): destination file key
        """
        copy_source = {
            'Bucket': self.bucket_name,
            'Key': old_key
        }
        self.bucket.copy(copy_source, new_key)

    def all_keys(self):
        """ Generator that yields every key in the bucket """
        continuation_token = None
        kwargs = {'Bucket': self.bucket_name,
                  'MaxKeys': 1000}
        while True:
            if continuation_token is not None:
                kwargs['ContinuationToken'] = continuation_token
            response = self.client.list_objects_v2(**kwargs)
            objects = response['Contents']
            has_more_pages = response['IsTruncated']
            for key in objects:
                yield key['Key']
            if not has_more_pages:
                break
            continuation_token = response.get('NextContinuationToken')
