MAX_SMS_MESSAGE_LENGTH = 160  # counted by charecters


def is_msg_too_long_for_sms(msg, limit=MAX_SMS_MESSAGE_LENGTH):
    return len(msg) > limit
