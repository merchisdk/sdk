import datetime
import sdk.python.entities
from sdk.python.quotes import Quote
from sdk.python.production_comments import ProductionComment
from sdk.python.jobs import Job
from sdk.python.files import File
from sdk.python.shipments import Shipment
from sdk.python.supply_domains import SupplyDomain
from sdk.python.notifications import Notification
from sdk.python.entities import Property


class Assignment(sdk.python.entities.Entity):

    resource = '/assignments/'
    json_name = 'assignment'

    id = Property(int)
    manager_accepts = Property(str)
    supplier_refused = Property(str)
    archived = Property(datetime.datetime)
    production_deadline = Property(datetime.datetime)
    assignment_deadline = Property(datetime.datetime)
    notes = Property(str)
    needs_shipping = Property(bool)
    job = Property(Job, backref="assignments")
    supply_job = Property(Job, backref="supply_assignment")
    supply_domain = Property(SupplyDomain, backref="supply_assignments")
    supplier = Property('sdk.python.users.User')
    quote = Property(Quote, backref="assignments")
    comments = Property(ProductionComment, backref="assignment")
    shipment = Property(Shipment, backref="assignments")
    notifications = Property(Notification)
    production_files = Property(File)


class Assignments(sdk.python.entities.Resource):

    entity_class = Assignment
    json_name = 'assignments'


assignments = Assignments()
