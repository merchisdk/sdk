import datetime
from werkzeug.utils import secure_filename
from typing import Any  # noqa #pylint: disable=unused-import
import sdk.python.entities
from sdk.python.entities import Property


class File(sdk.python.entities.Entity):

    resource = '/files/'
    json_name = 'file'
    url_fields = ['view_url', 'download_url']

    id = Property(str)
    name = Property(str)
    size = Property(int)
    mimetype = Property(str)
    view_url = Property(str)
    download_url = Property(str)
    creation_date = Property(datetime.datetime)

    def __init__(self):
        super(File, self).__init__()
        self.url_fields = ['view_url', 'download_url']
        self.file_data = []  # type: Any

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
