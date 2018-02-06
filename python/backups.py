import sdk.python.entities
from sdk.python.files import File


class Backup(sdk.python.entities.Entity):

    resource = '/backups/'
    json_name = 'backup'

    def __init__(self):
        super(Backup, self).__init__()

        self.json_property(int, 'id')
        self.recursive_json_property(File, 'file')


class Backups(sdk.python.entities.Resource):

    entity_class = Backup
    json_name = 'backups'


backups = Backups()
