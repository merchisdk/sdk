LOW = 0
MEDIUM = 1
HIGH = 2
URGENT = 3

NOTIFICATION_URGENCY_STRINGS = {LOW: "low",
                                MEDIUM: "medium",
                                HIGH: "high",
                                URGENT: "urgent"}


def urgent_string(urgent_code):
    """ Given integer urgent_code denoting the notification urgency,
        return a lower case string naming that urgency.
        Defaults to 'low' if the code is not known.
    """
    return NOTIFICATION_URGENCY_STRINGS.get(urgent_code, "low")


OPTIONS_ORDER = [LOW, MEDIUM, HIGH, URGENT]

URGENCY_OPTIONS =\
    [(section, urgent_string(section)) for section in OPTIONS_ORDER]
