import datetime
import sdk.python.entities
from sdk.python.entities import Property


class JobOperationLog(sdk.python.entities.Entity):

    resource = '/job_operation_logs/'
    json_name = 'jobOperationLog'

    id = Property(str)
    job_id = Property(int)
    user_id = Property(int)
    job = Property('sdk.python.jobs.Job', backref='operation_logs')
    user = Property('sdk.python.users.User', backref='job_operation_logs')
    source_type = Property(str)
    ai_involved = Property(bool)
    action = Property(str)
    payload_json = Property(dict)
    changes_json = Property(dict)
    operation_json = Property(dict)
    created_at = Property(datetime.datetime)


class JobOperationLogs(sdk.python.entities.Resource):

    entity_class = JobOperationLog
    json_name = 'jobOperationLogs'


job_operation_logs = JobOperationLogs()
