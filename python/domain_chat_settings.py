"""Domain chat settings entity for support chat widget configuration."""

import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.domains import Domain
from sdk.python.files import File


class DomainChatSettings(sdk.python.entities.Entity):
    """Per-domain configuration for the support chat widget (display name, welcome message, etc.)."""

    resource = '/domain_chat_settings/'
    json_name = 'domainChatSettings'

    id = Property(int)
    domain = Property(Domain)
    enabled = Property(bool)
    display_name = Property(str)
    avatar = Property(File)
    welcome_message = Property(str)
    privacy_policy_url = Property(str)
    working_hours = Property(list)  # JSON array of time windows
    away_message = Property(str)
    notify_email_new_conversation = Property(bool)
    notify_email_new_message = Property(bool)
    assigned_users = Property(list)
    require_guest_contact = Property(bool)
    auto_open_delay = Property(int)
    auto_open_message = Property(str)
    auto_open_mode = Property(str)


class DomainChatSettingsList(sdk.python.entities.Resource):
    """Resource for domain chat settings (one per domain)."""

    entity_class = DomainChatSettings
    json_name = 'domainChatSettingsList'


domain_chat_settings_list = DomainChatSettingsList()
