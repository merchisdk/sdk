import datetime
from sdk.python.production_comments import ProductionComment
from sdk.python.jobs import Job
from sdk.python.shipments import Shipment
from sdk.python.notifications import Notification


class Assignment(sdk.python.entities.Entity):

    resource = '/assignments/'
    json_name = 'assignment'

    id = Property(int)
    manager_accepts = Property(str)
    supplier_refused = Property(str)
    archived = Property(datetime.datetime)
    production_deadline = Property(datetime.datetime)
    assignment_deadline = Property(datetime.datetime)
    job = Property(Job, backref="assignments")
    supply_job = Property(Job, backref="supply_assignment")
    supplier = Property('sdk.python.users.User')
    bid = Property(Bid, backref="assignments")
    comments = Property(ProductionComment, backref="assignment")
    shipment = Property(Shipment, backref="assignments")
    notifications = Property(Notification)


class Assignments(sdk.python.entities.Resource):

    entity_class = Assignment
    json_name = 'assignments'


assignments = Assignments()
