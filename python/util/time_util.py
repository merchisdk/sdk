import datetime
import arrow
from dateutil import parser
import dateutil.tz as tz
from pytz import utc

HOUR = 1
DAY_IN_HOURS = HOUR * 24


def get_tzinfo_from_timezone_name(timezone):
    return tz.gettz(timezone)


def parse_time(time, tzinfo=None):
    if not time:
        return None
    try:
        time = arrow.get(time)
    except arrow.parser.ParserError:
        if isinstance(time, str):
            time = arrow.get(parser.parse(time))
        else:
            raise ValueError("can not parse datetime")
    return time.replace(tzinfo=tzinfo)


def convert(time, from_tzinfo, to_tzinfo):
    if not from_tzinfo:
        from_tzinfo = getattr(time, 'tzinfo', utc)
    arrow_obj = arrow.get(time)
    return arrow_obj.replace(tzinfo=from_tzinfo).to(to_tzinfo).datetime


def to_unix_timestamp(time):
    """ Return the unix timestamp of a specific time if time is not None
        otherwise return None
    """
    if not time:
        raise ValueError("got none instead of time")
    return arrow.get(time).timestamp


def from_unix_timestamp(timestamp):
    return datetime.datetime.utcfromtimestamp(int(timestamp))


def hours_to_seconds(n):
    return n * 3600


def minutes_to_seconds(n):
    return n * 60


def has_date_past(date_attribute):
    """ If now is greater than date_attribute then return True. """
    return arrow.now() > arrow.get(date_attribute)


def is_date_near(date_attribute, hours_until=DAY_IN_HOURS):
    """  Return True  if now + hours_until close to the given time
         attribute.
    """
    return arrow.now().shift(hours=+hours_until) > arrow.get(date_attribute)


def calculate_deadline(start_date, delivery_days, consider_business_hours=True,
                       timezone='Australia/Melbourne'):
    """Calculate deadline based on start_date, delivery_days and business hours.

    Args:
        start_date: The starting date (datetime or Arrow object)
        delivery_days: Number of days for delivery
        consider_business_hours: If True, only count business days
        timezone: Timezone for calculation

    Returns:
        datetime.datetime: The calculated deadline, or None if start_date is None
    """
    if not start_date:
        return None

    if not isinstance(start_date, arrow.Arrow):
        start_date = arrow.get(start_date)

    start_date = start_date.to(timezone)

    if consider_business_hours:
        # Check if received time is outside business hours (9am - 5pm)
        # or on a weekend
        is_weekend = start_date.weekday() >= 5
        is_after_hours = start_date.hour >= 17

        if is_weekend or is_after_hours:
            delivery_days += 1

        current_date = start_date
        while delivery_days > 0:
            current_date = current_date.shift(days=1)
            if current_date.weekday() < 5:
                delivery_days -= 1

        return current_date.ceil('day').datetime
    return start_date.shift(days=+delivery_days).ceil('day').datetime
