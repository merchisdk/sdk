import datetime
from werkzeug.utils import secure_filename
import sdk.python.entities
import sdk.python.users


class File(sdk.python.entities.Entity):

    resource = '/files/'
    json_name = 'file'
    url_fields = ['view_url', 'download_url']

    def __init__(self):
        super(File, self).__init__()
        self.url_fields = ['view_url', 'download_url']
        self.json_property(int, 'id')
        self.json_property(str, 'name')
        self.json_property(int, 'size')
        self.json_property(str, 'mimetype')
        self.json_property(str, 'view_url')
        self.json_property(str, 'download_url')
        self.json_property(datetime.datetime, 'creation_date')
        self.recursive_json_property(sdk.python.users.User, "uploader")
        self.file_data = []  # type: ignore

    def from_flask_file(self, flask_file):
        self.name = secure_filename(flask_file.filename)
        self.mimetype = flask_file.mimetype
        self.file_data = (self.name, flask_file, flask_file.mimetype)

    @property
    def is_image(self):
        try:
            return self.mimetype.split('/')[0] == 'image'
        except AttributeError:
            return True

    @property
    def is_pdf(self):
        return self.mimetype in {'application/pdf', 'application/x-pdf'}


class Files(sdk.python.entities.Resource):

    entity_class = File
    json_name = 'files'


files = Files()
