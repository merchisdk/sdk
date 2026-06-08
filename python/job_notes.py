import datetime
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.files import File


class JobNote(sdk.python.entities.Entity):

    resource = '/job_notes/'
    json_name = 'job_note'

    id = Property(int)
    note_type = Property(int)
    rich_text = Property(str)
    creation_date = Property(datetime.datetime)
    last_edited_time = Property(datetime.datetime)
    created_by = Property('sdk.python.users.User')
    last_edited_by = Property('sdk.python.users.User')
    files = Property(File)
    job = Property('sdk.python.jobs.Job', backref='job_notes')


class JobNotes(sdk.python.entities.Resource):

    entity_class = JobNote
    json_name = 'jobNotes'


job_notes = JobNotes()
