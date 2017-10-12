def date_ordinal_english(date):
    return rank_ordinal_english(date)


def rank_ordinal_english(number):
    """ Return a string which adds the apropriate rank suffix to the given
        number. For example, given 2, returns '2nd'.
    """
    if 4 <= number <= 20:
        return str(number) + 'th'
    elif 0 < number % 10 < 4:
        return str(number) + ['st', 'nd', 'rd'][number % 10 - 1]
    return str(number) + 'th'
