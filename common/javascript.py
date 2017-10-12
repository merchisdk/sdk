import unicodedata


RESERVED_WORDS = {'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case',
                  'else', 'enum', 'eval', 'false', 'null', 'this', 'true',
                  'void', 'with', 'break', 'catch', 'class', 'const', 'super',
                  'throw', 'while', 'yield', 'delete', 'export', 'import',
                  'public', 'return', 'static', 'switch', 'typeof', 'default',
                  'extends', 'finally', 'package', 'private', 'continue',
                  'debugger', 'function', 'arguments', 'interface', 'protected',
                  'implements', 'instanceof'}


def is_valid_variable_name(name):
    """ Return True if name is a possible javascript variable name, else False.

        Allows unicode characters - it's not checking if it's the name is good.
    """
    def is_valid_first_char(c):
        if unicodedata.category(c) in {'Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'NI'}:
            return True
        if c in {'$', '_'}:
            return True
        return False

    def is_valid_char(c):
        valid_categories = {'Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'NI', 'Mn', 'Mc',
                            'Nd', 'Pc'}
        if unicodedata.category(c) in valid_categories:
            return True
        if c in {'$', '_', '\u200c', '\u200d'}:
            return True
        return False

    if not name:
        return False
    if not is_valid_first_char(name[0]):
        return False
    if not all(is_valid_char(c) for c in name[1:]):
        return False
    if name.lower() in RESERVED_WORDS:
        return False
    return True
