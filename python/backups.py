import sdk.python.entities
from sdk.python.files import File
from sdk.python.entities import Property


class Backup(sdk.python.entities.Entity):

    resource = '/backups/'
    json_name = 'backup'

    id = Property(int)
    file = Property(File)


class Backups(sdk.python.entities.Resource):

    entity_class = Backup
    json_name = 'backups'


backups = Backups()
