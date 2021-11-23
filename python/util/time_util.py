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
