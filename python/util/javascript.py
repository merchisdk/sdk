import unicodedata


RESERVED_WORDS = {'do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case',
                  'else', 'enum', 'eval', 'false', 'null', 'this', 'true',
                  'void', 'with', 'break', 'catch', 'class', 'const', 'super',
                  'throw', 'while', 'yield', 'delete', 'export', 'import',
                  'public', 'return', 'static', 'switch', 'typeof', 'default',
                  'extends', 'finally', 'package', 'private', 'continue',
                  'debugger', 'function', 'arguments', 'interface', 'protected',
                  'implements', 'instanceof'}


def is_valid_first_char(char):
    """ Return whether char is a valid character for the start of a js symbol.

        Reference: http://es5.github.io/x7.html#x7.6
    """
    category = unicodedata.category(char)
    return char in {'$', '_'} or category in {'Lu', 'Ll', 'Lt' 'Lm', 'Lo', 'NI'}


def is_valid_char(char):
    """ Return whether char is a valid character for a js symbol.

        Reference: http://es5.github.io/x7.html#x7.6
    """
    category = unicodedata.category(char)
    allowed = {'Lu', 'Ll', 'Lt' 'Lm', 'Lo', 'NI', 'Mn', 'Mc', 'Nd', 'Pc'}
    return char in {'$', '_', '\u200c', '\u200d'} or category in allowed


def is_valid_variable_name(name):
    """ Return True if name is a possible javascript variable name, else False.

        Allows unicode characters - it's not checking if it's the name is good.
    """
    if not name:
        return False
    if not is_valid_first_char(name[0]):
        return False
    if not all(is_valid_char(c) for c in name[1:]):
        return False
    if name.lower() in RESERVED_WORDS:
        return False
    return True
