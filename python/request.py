import requests
import json
from sdk.python.util.name_protocol import parse_json_key_camel, \
    unpack_recursive_json

PROTOCOL_VERSION = 6


def process_dict_param(embed):
    if embed is not None:
        if isinstance(embed, (dict, list)):
            embed = json.dumps(embed)
        elif isinstance(embed, str):
            pass
        else:
            raise ValueError("the value for embed is invalid")
    return embed


class Request(object):

    def __init__(self):
        self.server = ''
        self.host = ''
        self.version = 'v' + str(PROTOCOL_VERSION)
        self.method = 'GET'
        self.resource = '/'
        self.query = {}
        self.headers = {}
        self.username = None
        self.embed = None
        self.password = None
        self.api_secret = None
        self.as_domain = None  # only be meaningful if using be master domain
        self.include_archived = None
        self.skip_rights = False
        self.data = {}  # set to dict to send form encoded
        self.files = {}
        self.cookies = {}

    def path(self):
        return self.version + self.resource

    def url(self):
        return self.server + self.path()

    def auth(self):
        if self.username is not None:
            return self.username, self.password
        return None

    def version_number(self):
        return int(self.version[1:])

    def wraps_request(self, data=None, files=None, email=None, password=None,
                      api_secret=None, query=None, embed=None, as_domain=None,
                      include_archived=None, skip_rights=None):
        """ Wrap user customized infomation to request """
        self.files = files
        self.data = data
        self.username = email
        self.password = password
        self.api_secret = api_secret
        self.embed = embed
        self.as_domain = as_domain
        if include_archived is not None:
            self.include_archived = include_archived
        if skip_rights:
            self.skip_rights = skip_rights
        self.skip_rights = skip_rights
        if not self.query:
            self.query = {}
        if query is not None:
            self.query.update(query)

    def send(self):
        if self.data:
            data_json = parse_json_key_camel(self.data)
            data_post = unpack_recursive_json(data_json, self.version_number())
        else:
            data_post = None

        if self.api_secret:
            self.query["api_secret"] = self.api_secret

        if self.embed:
            self.query["embed"] = process_dict_param(self.embed)

        if self.as_domain:
            self.query["as_domain"] = self.as_domain

        if self.include_archived is not None:
            if isinstance(self.include_archived, (dict, list)):
                include_archived = json.dumps(self.include_archived)
            else:
                include_archived = self.include_archived
            self.query["include_archived"] = include_archived

        if self.skip_rights:
            self.query["skip_rights"] = self.skip_rights

        self.headers['host'] = self.host

        sender = self.get_sender_func()

        return sender(self.method, url=self.url(), params=self.query,
                      headers=self.headers, data=data_post, files=self.files,
                      cookies=self.cookies, auth=self.auth())

    def get_sender_func(self):
        """ Return function that actually sends requests.

            This can be overidden, e.g. for test mocks.
        """
        return requests.request
