import datetime
import sdk.python.entities
import sdk.python.job_comments
import sdk.python.production_comments
import sdk.python.domains
import sdk.python.files
import sdk.python.util.notification_sources as note_source
import sdk.python.util.notification_type as note_type
from sdk.python.util.brand_util import PLATFORM_MASCOT_ICON
from sdk.python.entities import Property


class Notification(sdk.python.entities.Entity):

    resource = '/notifications/'
    json_name = 'notification'

    id = Property(int)
    date = Property(datetime.datetime)
    domain = Property(sdk.python.domains.Domain)
    related_job_comment = Property(sdk.python.job_comments.JobComment,
                                   backref="notifications")
    related_draft_comment = Property("sdk.python.draft_comments.DraftComment")
    related_production_comment = Property(sdk.python.production_comments.
                                          ProductionComment,
                                          backref="notifications")
    attachment = Property(sdk.python.files.File)
    avatar = Property(sdk.python.files.File)
    seen = Property(bool)
    send_email = Property(bool)
    send_sms = Property(bool)
    urgency = Property(int)
    notification_type = Property(int)
    description = Property(str)
    subject = Property(str)
    message = Property(str)

    # not embedded by default, must be requested
    html_message = Property(str)

    link = Property(str)
    section = Property(int)

    def have_link(self):
        return self.link and self.link.lower() != 'none'

    def can_reply(self, role):
        """ Check whether user the user has the right to reply to a
            notification.
        """
        if int(self.section) not in note_source.section_roles:
            return False
        elif role in note_source.section_roles[int(self.section)]:
            return True
        return False

    def notification_title(self):
        """ Check to see if notifications has a subject
            and return a special title if this is the case
        """
        if self.subject and self.subject != "None":
            if self.related_job:
                return "{0} - {1}".format(self.subject,
                                          self.domain.email_domain)
            return self.subject
        return self.description

    def job_notification_title(self):
        """ Check to see if notifications has a subject and return a
            a shorter job notification title specifically for jobs
        """
        if self.subject and self.subject != "None":
            return self.subject
        return self.description

    def avatar_url(self):
        """ Return the URL of the correct avatar to use for the
            notification
        """
        notification_type = self.notification_type
        sender = self.sender
        domain = self.domain
        if notification_type in note_type.SHOW_USER_AVATAR and sender:
            return sender.profile_picture_url(50)
        if notification_type in note_type.SHOW_DOMAIN_AVATAR and domain:
            return domain.logo_url()
        if notification_type in note_type.SHOW_USER_OR_DOMAIN_AVATAR:
            if sender:
                return sender.profile_picture_url(50)
            if domain:
                return domain.logo_url()
        if notification_type in note_type.SHOW_DOMAIN_OR_USER_AVATAR:
            if domain:
                return domain.logo_url()
            if sender:
                return sender.profile_picture_url(50)
        return PLATFORM_MASCOT_ICON


class Notifications(sdk.python.entities.Resource):

    entity_class = Notification
    json_name = 'notifications'


notifications = Notifications()
