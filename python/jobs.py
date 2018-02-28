# pylint: disable=E0203
import collections
import datetime
import sdk.python.entities
from sdk.python.users import User
from sdk.python.products import Product
from sdk.python.job_comments import JobComment
from sdk.python.draft_comments import DraftComment
from sdk.python.production_comments import ProductionComment
from sdk.python.country_taxes import CountryTax
from sdk.python.domains import Domain
from sdk.python.drafts import Draft
from sdk.python.invoices import Invoice
from sdk.python.files import File
from sdk.python.addresses import Address
from sdk.python.bids import Bid
from sdk.python.shipments import Shipment
from sdk.python.companies import Company
from sdk.python.specifications import Specification, SpecificationsGroup
from sdk.python.notifications import Notification
from sdk.python.util.status import PRODUCTION_STATUS, PAYMENT_STATUS, \
    DESIGN_STATUS, SHIPPING_STATUS, status_info
from sdk.python.util import events
from sdk.python.util.roles import MANAGER, ADMIN
from sdk.python.util.notification_sources import JOB_SECTION_STRINGS
from sdk.python.util.business_default import PRIORITY_OPTIONS_REVERSE_MAP, \
    LOW_STRING


class Job(sdk.python.entities.Entity):

    resource = '/jobs/'
    json_name = 'job'

    def __init__(self):
        super(Job, self).__init__()
        self.escape_fields = ['product', 'quantity', 'tax_type']
        self.json_property(int, 'id')
        self.recursive_json_property(User, 'client')
        self.recursive_json_property(User, 'manager')
        self.recursive_json_property(User, 'designer')
        self.recursive_json_property(Product, 'product')
        self.recursive_json_property(JobComment, 'comments')
        self.recursive_json_property(DraftComment, 'draft_comments')
        self.recursive_json_property(Draft, 'drafts')
        self.recursive_json_property(Invoice, 'invoice')
        self.recursive_json_property(Domain, 'domain')
        self.recursive_json_property(Address, 'shipping')
        self.recursive_json_property(Address, 'production_shipping_address')
        self.recursive_json_property(Notification, 'notifications')
        self.recursive_json_property(Company, 'client_company')
        self.json_property(int, 'quantity')
        self.json_property(str, 'notes')
        self.json_property(str, 'production_notes')
        self.json_property(int, 'production_status')
        self.json_property(int, 'design_status')
        self.json_property(int, 'payment_status')
        self.json_property(int, 'shipping_status')
        self.json_property(bool, 'completed')
        self.json_property(int, 'priority')
        self.recursive_json_property(File, 'production_files')
        self.recursive_json_property(File, 'client_files')
        self.recursive_json_property(Assignment, 'assignments')
        self.json_property(str, 'domain')
        self.json_property(datetime.datetime, 'archived')
        self.json_property(datetime.datetime, 'received')
        self.json_property(datetime.datetime, 'deadline')
        self.json_property(datetime.datetime, 'updated')
        self.json_property(float, 'cost_per_unit')
        self.json_property(bool, 'automatic_price_enabled')
        self.json_property(float, 'tax_amount')
        self.json_property(float, 'cost')
        self.json_property(float, 'job_weight')
        self.json_property(float, 'job_volume')
        self.json_property(bool, 'needs_production')
        self.json_property(bool, 'needs_drafting')
        self.json_property(bool, 'needs_shipping')
        self.recursive_json_property(SpecificationsGroup,
                                     'specifications_groups')
        self.recursive_json_property(Specification, 'specifications')
        self.recursive_json_property(Shipment, 'shipment')
        self.recursive_json_property(CountryTax, 'tax_type')

    def product_total_cost(self):
        """ Return the cost_per_unit multiplied by the total job
            quantity
        """
        return self.quantity * self.cost_per_unit

    def process_for_transfer(self):
        self.updated = None

    def is_draft_accepted(self):
        """ Return True if the current draft for this job has been accepted,
            or False otherwise.
        """
        try:
            current_draft = self.drafts[0]
        except IndexError:
            return False
        if current_draft.accepted:
            return True
        return False

    def priority_name(self):
        """ Return a string from one of the constants defined in
            sdk.python.util.business_default that represents the priority of
            this job.
        """
        return PRIORITY_OPTIONS_REVERSE_MAP.get(self.priority, LOW_STRING)

    def current_draft(self):
        """ Return the most recent job draft from an array of job drafts """
        if len(self.drafts) > 0:
            return self.drafts[0]
        return None

    def most_recent_draft_id(self):
        """ Return the current draft id for the job or None if no drafts.
            Requires that the draft objects be embedded when fetching
            this job object.
        """
        if len(self.drafts) == 0:
            return None
        return self.drafts[0].id

    def supplier(self, only_approved=False):
        """ Return either a list of suppliers, a single supplier, or None,
            depending on what stage the job is in and what suppliers have
            been assigned. Requires that assignments.supplier be embedded
            with the job when fetching it.
        """
        if self.assignments:
            if only_approved:
                for a in self.assignments:
                    if a.manager_accepts:
                        return a.supplier
            else:
                return [a.supplier for a in self.assignments]
        return None

    def is_production_in_house(self):
        """ Return True if one of the job assignment suppliers is a manager """
        return any(a.supplier.has_authority(self.domain.id, [ADMIN, MANAGER])
                   for a in self.assignments)

    def in_house_assignment(self):
        """ Return an assignment if the assignment is in-house """
        if self.is_production_in_house():
            return self.assignments[0]
        return None

    def accepted_assignment(self):
        """ Return the production assignment accepted by the manager """
        for assignment in self.assignments:
            if assignment.manager_accepts:
                return assignment
        return None

    def assignment_deadline(self):
        """ Return the assignment deadline from one of the assignments """
        if len(self.assignments) > 0:
            return self.assignments[0].assignment_deadline
        return None

    def assignment_by_supplier_id(self, user_id):
        """ Return a job assignment associated with
            the user provided and return None if no assignment can
            be found with the user.
        """
        assignment = None
        for assignment in self.assignments:
            if assignment.supplier.id is user_id:
                assignment = assignment
        return assignment

    def production_shipment(self):
        """ Return the shipment object which has been created for production
            procedure.
        """
        for assignment in self.assignments:
            if assignment.shipment:
                return assignment.shipment
        return None

    def production_display_info(self):
        """ Return the PRODUCTION_STATUS dict from
            sdk.python.util.status with the values based on the
            job.production_status
        """
        return status_info(self.production_status,
                           PRODUCTION_STATUS, "production ")

    def design_display_info(self):
        """ Return the DESIGN_STATUS dict from
            sdk.python.util.status with the values based on the
            job.design_status
        """
        return status_info(self.design_status, DESIGN_STATUS, "design ")

    def payment_display_info(self):
        """ Return the PAYMENT_STATUS dict from
            sdk.python.util.status with the values based on the
            job.payment_status
        """
        return status_info(self.payment_status, PAYMENT_STATUS, "payment ")

    def shipment_display_info(self):
        """ Return the SHIPPING_STATUS dict from sdk.python.util.status with the values
            based on the job.shipping_status
        """
        return status_info(self.shipping_status, SHIPPING_STATUS, "shipment ")

    def supplier_shipment_info(self):
        """ Return the shipping information submitted buy the supplier """
        assignment = self.accepted_assignment()
        if assignment:
            return assignment.shipment
        return None

    def product_unit_price(self):
        """ Display the product unit_price. This value takes into consideration
            discounted unit price based on server calculated product unit price
            after it got discounted
        """
        return self.cost_per_unit

    def assignment_earliest_production(self):
        """ Return the assignment which is able to get the
            production completed in the fastest amount of time
        """
        earliest_deadline = None
        earliest_supplier = None
        for assignment in self.assignments:
            if assignment.bid:
                agreed_deadline = assignment.bid.agreed_deadline
                if not earliest_deadline or agreed_deadline < earliest_deadline:
                    earliest_deadline = assignment.bid.agreed_deadline
                    earliest_supplier = assignment
        return earliest_supplier

    def assignment_lowest_bid(self):
        """ Return the lowest bid out of all the assignments """
        lowest_bid = None
        lowest_supplier = None
        for assignment in self.assignments:
            if assignment.bid:
                if not lowest_bid or assignment.bid.bid_total() < lowest_bid:
                    lowest_bid = assignment.bid.bid_total()
                    lowest_supplier = assignment
        return lowest_supplier

    def get_section_name(self, section):
        """ Generate section name that can be used to generate private attribute
            to store notifications info of different sections in job.
        """
        fmt = "_{}_notifications_"
        if not section:
            return fmt.format("all")
        return fmt.format(JOB_SECTION_STRINGS[section])

    def user_job_notifications(self, user):
        """ Return job notifications which the current user is the recipient """
        notes = self.notifications
        return [n for n in notes if n.recipient and n.recipient.id == user.id]

    def user_unseen_job_notifications(self, user):
        """ Return all the job notifications of the provided user as the
            recipient if the notification has not been marked as seen
        """
        return [n for n in self.user_job_notifications(user) if not n.seen]

    def user_unseen_job_notifications_count(self, user):
        """ Return the length of the user_unseen_job_notifications method """
        return len(self.user_unseen_job_notifications(user))

    def unseen_notifications_by_section(self, user, section_int):
        """ Return all job related notifications of the current user
            as the recipient which have not been marked as 'seen' and which
            are in provided section
        """
        notes = self.user_unseen_job_notifications(user)
        return [n for n in notes if section_int == n.section]

    def unseen_notifications_by_section_count(self, user, section_int):
        """ Return the length of the unseen_notifications_by_section method """
        return len(self.unseen_notifications_by_section(user, section_int))

    def shipping_finished(self):
        """ Return whether the shipping has been finished """
        return self.shipping_status >= \
            SHIPPING_STATUS["DISPATCHED"]["dbValue"] or \
            not self.needs_shipping

    def drafting_finished(self):
        """ Return whether the drafting has been finished """
        return self.design_status >= \
            DESIGN_STATUS["DRAFTING_APPROVED"]["dbValue"] or \
            not self.needs_drafting

    def production_finished(self):
        """ Return whether the production has been finished """
        return (self.production_status is not None and
                self.production_status >=
                PRODUCTION_STATUS["SHIPPED"]["dbValue"]) or \
            not self.needs_production

    def payment_finished(self):
        """ Return whether the payment has been finished """
        if self.payment_status:
            return self.payment_status >= \
                PAYMENT_STATUS["FULLY_PAID"]["dbValue"]

    def is_ready_to_complete(self):
        """ Return whether the job is ready for move to the
            completed stage
        """
        return self.drafting_finished() and self.production_finished() and\
            self.payment_finished() and self.shipping_finished()

    def dictionary_of_related_address_names_and_ids(self, job_shipping=True,
                                                    production_shipping=True,
                                                    manager_addresses=True,
                                                    client_addresses=True):
        """ Return a list of the related job address ids and names.  """
        saved_addresses = []
        if self.shipping and job_shipping:
            saved_addresses.append({'name': 'Job Shipping Address',
                                    'id': self.shipping.id})

        if self.production_shipping_address and production_shipping:
            saved_addresses.append({'name': 'Job Shipping Address',
                                    'id': self.production_shipping_address.id})

        if self.client and client_addresses:
            saved_addresses += self.client. \
                dictionary_of_addresses_and_ids("Client Address")
        if self.manager and manager_addresses:
            saved_addresses += self.manager. \
                dictionary_of_addresses_and_ids("Manager Address")

        return saved_addresses

    def draft_time_line(self, reverse=True):
        """ Return job draft related object in chronological order
            as a dictionary. This is used for creating a job draft timeline.
        """
        time_line_dict = {}

        for comment in self.draft_comments:
            time_line_dict[comment.date] = \
                events.Event(events.DRAFT_COMMENT, comment)
        for draft in self.drafts:
            time_line_dict[draft.date] = \
                events.Event(events.DRAFT_UPLOADED, draft)
            if draft.accepted:
                time_line_dict[draft.accepted] = \
                    events.Event(events.DRAFT_APPROVED, draft.accepted)
            if draft.resend_date:
                time_line_dict[draft.resend_date] = \
                    events.Event(events.DRAFT_RESENT, draft.resend_date)
            for comment in draft.comments:
                if comment.change_request:
                    time_line_dict[comment.date] = \
                        events.Event(events.DRAFT_REJECTED, comment)
                else:
                    time_line_dict[comment.date] = \
                        events.Event(events.DRAFT_COMMENT, comment)

        return collections.OrderedDict(sorted(time_line_dict.items(),
                                              reverse=reverse,
                                              key=lambda t: t[0]))

    def job_info_time_line(self, reverse=True):
        """ Return the job comments in reverse with the youngest at
            bottom of the list.
        """
        time_line_dict = {}
        for comment in self.comments:
            time_line_dict[comment.date] = \
                events.Event(events.JOB_COMMENT, comment)
        return collections.OrderedDict(sorted(time_line_dict.items(),
                                              reverse=reverse,
                                              key=lambda t: t[0]))

    def is_complete_string(self):
        """ Return a string 'Completed' if the job is complete
            else it will return a string 'Uncompleted'.
        """
        if self.completed:
            return "Completed"
        return "Uncompleted"

    def can_be_archived_by(self, user):
        """ Check if the job can be archived by the user making the request. """
        return self.rights.delete

    def total_inc_tax(self):
        """ Return the job cost + the tax amount """
        return self.tax_amount + self.cost


class Jobs(sdk.python.entities.Resource):

    entity_class = Job
    json_name = 'jobs'


class Assignment(sdk.python.entities.Entity):

    resource = '/assignments/'
    json_name = 'assignment'

    def __init__(self):
        super(Assignment, self).__init__()

        self.json_property(int, 'id')
        self.json_property(str, 'manager_accepts')
        self.json_property(str, 'supplier_refused')
        self.json_property(datetime.datetime, 'archived')
        self.json_property(datetime.datetime, 'production_deadline')
        self.json_property(datetime.datetime, 'assignment_deadline')
        self.recursive_json_property(Job, 'job')
        self.recursive_json_property(User, 'supplier')
        self.recursive_json_property(Bid, 'bid')
        self.recursive_json_property(ProductionComment, 'comments')
        self.recursive_json_property(Shipment, 'shipment')
        self.recursive_json_property(Notification, 'notifications')


class Assignments(sdk.python.entities.Resource):

    entity_class = Assignment
    json_name = 'assignments'


jobs = Jobs()
assignments = Assignments()
