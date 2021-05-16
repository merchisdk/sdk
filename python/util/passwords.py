""" Utilities for looking up whether a given password exists in a (large) list
    of banned passwords.

    Most of the passwords in the banned list come from dumps of 'hacked' web-
    sites, etc., but it can also make use of other dictionaries, wordlists,
    and any passwords that you want to explicity ban. Using dumps from 'hacked'
    websites prevent users from reusing leaked passwords. Using wordlists and
    dictionaries prevent users from using excessively weak passwords. We know
    that attackers use dictionaries to speed up brute force attacks on
    passwords (a "dictionary attack"), so we can protect against that if we
    know the types of dictionaries they are using.

    The practice of checking passwords against a blacklist is supported by
    NIST Special Publication 800-63-3: Digital Authentication Guidelines. We
    know empirically that a very large number of website accounts have poor or
    trivial passwords such as 'password', explaining the effectiveness of this
    approach. It can be combined with two-factor authentication and miniumum
    password lengths for greater protection against users choosing weak
    passwords.

    There are some limitations: this module only performs exact match search,
    therefore it requires every banned password to be listed explicitly. An
    actor performing a dictionary attack may, on the other hand, mix it up a
    bit, e.g. try adding numbers or puntuation to the end of the word, replace
    0 with O, and vice versa, etc. An attacker may also search for 'patterns'
    like, "all zeroes", etc. Additionally, an attacker with knowledge of the
    victim may try personal information like spouses name, birthday, etc. If you
    want to block those, they have to be added to the banned list explicitly.

    The utilities in this module cannot guarantee that a password is good, nor
    can it protect a good password from being leaked through side channels, it
    can merely identify (a large and important!) class of bad password.

    The meat of the interface is `is_password_known_bad`, which will return
    True if the password should be forbidden from being used.

    The wordlists are stored in newline seperated text files in the directory
    `password_dumps/`, and then coverted to a more efficient database by
    `compile_password_list`. The first use of `is_password_known_bad` in a
    given python process may be slow if you do not first load the database
    into memory using `get_password_database()`.
"""
import os
import unicodedata
import dawg
import sdk.python.util.crypto as crypto


PASSWORD_DATABASE_FILENAME = 'cracked_passwords.dawg'
PASSWORD_DATABASE = None


def get_password_dumps():
    """ Yield the path of every file in the password_dumps directory,
        descending subdirectories recursively.
    """
    for subdir, _, files in os.walk('password_dumps'):
        for filename in files:
            filepath = subdir + os.sep + filename
            yield filepath


def get_passwords_from_dump(filepath: str):
    """ Yield every line in file from the given filename. """
    with open(filepath) as dump:
        for line in dump:
            yield line


def get_passwords_from_dumps():
    """ Yield every line in every (text) file in password_dumps directory """
    for dump in get_password_dumps():
        for password in get_passwords_from_dump(dump):
            yield password


def normalise_for_db(password):
    """ Convert (very) similar passwords into a single canonical form. """
    password = unicodedata.normalize('NFKC', password)
    password = password.casefold()
    password = password.strip()
    password = unicodedata.normalize('NFKC', password)
    return password


def get_valid_passwords_from_dumps():
    """ Yield every line in every text file in password_dumps directory that
        is within the password length requirements.
    """
    for password in get_passwords_from_dumps():
        if len(password) < crypto.SHORTEST_NEW_PASSWORD:
            continue
        if len(password) > crypto.MAX_PASSWORD_LENGTH:
            continue
        password = normalise_for_db(password)
        if password:
            yield password


def build_dawg_from_dumps():
    """ Return a directed acyclic word graph (dawg.DAWG) containing every
        password (listed on a new line) in every file in password_dumps
        directory.
    """
    return dawg.DAWG(get_valid_passwords_from_dumps())


def compile_password_list():
    """ Take every password listed on a new line in text files in the
        password_dumps directory, and store them in a directed acyclic graph
        in a file named 'cracked_passwords.dawg'. Intended that it may be
        used to help answer the question 'is this a known bad password?'.
    """
    store = build_dawg_from_dumps()
    store.save(PASSWORD_DATABASE_FILENAME)


def load_password_database():
    """ Load DAWG of cracked passwords from pre defined filepath and returns
        it as a dawg.DAWG.
    """
    result = dawg.DAWG()
    result.load(PASSWORD_DATABASE_FILENAME)
    return result


def get_password_database():
    """ Return dawg.DAWG of cracked passwords, either from cached copy, or
        loading from file id nessecary.
    """
    global PASSWORD_DATABASE
    if not PASSWORD_DATABASE:
        PASSWORD_DATABASE = load_password_database()
    return PASSWORD_DATABASE


def is_password_known_bad(password: str) -> bool:
    """ Return True if the given password is known in our list of weak or
        cracked or leaked passwords, otherwise returns False. N.B. A False
        return value does not mean that the password is good, merely that we
        not been able to prove it bad by finding it in an existing password
        dump or dictionary.
    """
    if password is None:
        return True
    password = normalise_for_db(password)
    return password == '' or password in get_password_database()
