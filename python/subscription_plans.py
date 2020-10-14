import datetime
import sdk.python.entities
from sdk.python.country_taxes import CountryTax
import sdk.python.users
import sdk.python.country_taxes
from sdk.python.entities import Property


class SubscriptionPlan(sdk.python.entities.Entity):

    resource = '/subscription_plans/'
    json_name = 'subscriptionPlan'

    id = Property(int)
    name = Property(str)
    created = Property(datetime.datetime)
    updated = Property(datetime.datetime)
    created_by = Property('sdk.python.users.User')
    updated_by = Property('sdk.python.users.User')
    currency = Property(str)
    tax = Property(CountryTax)
    base_cost = Property(float)
    white_label_domain_cost = Property(float)
    per_sms_cost = Property(float)
    per_user_cost = Property(float)
    per_domain_cost = Property(float)
    base_user_count = Property(int)
    base_domain_count = Property(int)
    billing_cycle_days = Property(int)
    is_private = Property(bool)
    show_public = Property(bool)


class SubscriptionPlans(sdk.python.entities.Resource):

    entity_class = SubscriptionPlan
    json_name = 'subscriptionPlans'


subscription_plans = SubscriptionPlans()
