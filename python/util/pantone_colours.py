"""Pantone colour catalog for variation fields.

Swatches are screen approximations from the MIT-licensed Pantoner library
(coated, uncoated, metallic, and pastel books). They are not official
Pantone digital colour values.
"""

import json
import os
import re

_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "pantone_colours.json")

with open(_DATA_PATH, encoding="utf-8") as _handle:
    PANTONE_COLOURS = json.load(_handle)

_BY_CODE = {colour["code"].upper(): colour for colour in PANTONE_COLOURS}

_PREFIX = re.compile(r"^(?:pantone|pms)\s+", re.IGNORECASE)
_SPACE = re.compile(r"\s+")
_JOINED_SUFFIX = re.compile(r"^(\d+)([A-Za-z])$")


def normalise_pantone_code(value):
    """Return the catalog code (for example ``185 C``) or ``None``."""
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    text = _PREFIX.sub("", text)
    text = text.replace("_", " ").replace("-", " ")
    text = _SPACE.sub(" ", text).strip()
    parts = text.split(" ")
    if parts:
        match = _JOINED_SUFFIX.match(parts[-1])
        if match:
            parts[-1] = match.group(1)
            parts.append(match.group(2))
    key = " ".join(parts).upper()
    colour = _BY_CODE.get(key)
    if colour is None:
        return None
    return colour["code"]


def pantone_hex(value):
    """Return the approximate hex for a Pantone code, or ``None``."""
    code = normalise_pantone_code(value)
    if code is None:
        return None
    return _BY_CODE[code.upper()]["hex"]
