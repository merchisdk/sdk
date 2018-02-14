""" Functionaility to talk to gravatar.

    Gravatar (www.gravatar.com) is a free service for looking up a profile
    picture against an email address. It is used by a lot of sites including
    github, stackoverflow, disqus, wordpress, etc, etc so it has a large
    database of profile pictures. It can also fall back to a default/blank
    profile picture, or one that we supply. It is possible to use gravatar
    for free, and leak no information other than our interest in the profile
    picture that belongs to a given email address.
"""

import urllib.request
import urllib.parse
import urllib.error
import hashlib


def gravatar_url(email, size):
    """ Look up a profile picture for the given email address or otherwise a
        default profile picture.

        Args:
          email (str): the email address to look up by
          size (int): the size of the profile picture image to serve

        Returns:
          string: a URI where gravatar will server the image
    """
    email = str(email).encode('utf-8')
    return "https://www.gravatar.com/avatar/" + \
           hashlib.md5(email.lower()).hexdigest() + "?" + \
           urllib.parse.urlencode({'d': 'mm', 's': str(size)})
