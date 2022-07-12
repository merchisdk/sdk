""" Provide Utilities for checking the safety of google analytics scripts.  """
import re

script = """
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = {conversion_id};
var google_conversion_language = "{conversion_language}";
var google_conversion_format = "{conversion_format}";
var google_conversion_color = "{conversion_colour}";
var google_conversion_label = "{conversion_label}";
var google_conversion_value = {conversion_value};
var google_conversion_currency = "{conversion_currency}";
var google_remarketing_only = {remarketing_only};
/* ]]> */
</script>
<script type="text/javascript"
        src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" src="{pixel_url}"/>
</div>
</noscript>
"""

global_script = """
<script async src="https://www.googletagmanager.com/gtag/js?id={}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', '{}');
</script>
"""


conversion_script = """
<script>
  gtag('event', 'conversion', {{'currency': {},
                                'value': {},
                                {}}});
</script>
"""


class ScriptError(Exception):

    pass


r_dot = r"\."

r_digit = r"\d"

r_hex_digit = r"[0-9a-fA-F]"

r_colour = r_hex_digit * 6

r_int = r_digit + "+"

r_lower = r"[a-z]"

r_safe_str_char = r"[a-zA-Z0-9_\-!@#$%^&*(){};:/=+?><,.\]\[\\|\s]"

r_safe_str_contents = r_safe_str_char + "*"

r_int = r_digit + r"+"

r_upper = r"[A-Z]"

r_currency = r_upper * 3

r_bool = r"false|true"


def r_or(a, b):
    return r"(({a})|({b}))".format(a=a, b=b)


r_float = r_or(r_int, r_int + r_dot + r_int)

r_bool_or_str_bool = r_or(r_bool, r"'(true|false)'|\"(true|false)\"")

r_simple_str = r"['\"]" + r_safe_str_contents + r"['\"]"

r_value = r_or(r_or(r_or(r_bool, r_int), r_float), r_simple_str)

r_obj_key = r_or(r_safe_str_contents, r_simple_str)


def r_val(content):
    return "(?P<value>" + content + ")"


def r_dec(variable_name, rvalue_format):
    return r"\s*var\s+" + variable_name + r"\s*=\s*" + rvalue_format


def r_str(content):
    return '"' + content + '"'


def r_pixel_element(content):
    return r'<img height="1" width="1" style="border-style:none;"' +\
        r' alt="" src="' + content + '"/>'


def r_optional(content):
    return r"(({})?)".format(content)


r_query_value = r_safe_str_contents

r_query_key_value = r_query_value + r_or("&", ";") + r_query_value

r_query_entity = r_or(r_query_value, r_query_key_value)

r_query_string = r"\?(" + r_query_entity + r")*"

r_conversion_id = re.compile(r_dec("google_conversion_id", r_val(r_int)))

r_conversion_language = re.compile(r_dec("google_conversion_language",
                                         r_str(r_val(r_safe_str_contents))))
r_conversion_format = re.compile(r_dec("google_conversion_format",
                                       r_str(r_val(r_digit))))
r_conversion_colour = re.compile(r_dec("google_conversion_color",
                                       r_str(r_val(r_colour))))
r_conversion_label = re.compile(r_dec("google_conversion_label",
                                      r_str(r_val(r_safe_str_contents))))
r_conversion_value = re.compile(r_dec("google_conversion_value",
                                      (r_val(r_float))))
r_conversion_currency = re.compile(r_dec("google_conversion_currency",
                                         r_str(r_val(r_currency))))
r_remarketing_only = re.compile(r_dec("google_remarketing_only",
                                      r_val(r_bool_or_str_bool)))


def r_gtag_call(contents):
    return r"\s*gtag\(\s*" + contents + r"\s*\)\s*"


def r_config_call(param):
    return r_gtag_call(r"['\"]config['\"]\s*,\s*" + param)


r_tag_fmt = r"[a-zA-Z0-9\-_]+"

r_str_global = r_config_call(r"['\"]" + r_val(r_tag_fmt) + r"['\"]")


def r_conversion_call(param):
    conversion = r"['\"]event['\"]\s*,\s*['\"]conversion['\"]\s*,\s*" + param
    return r_gtag_call(conversion)


r_obj_key_pair = r_obj_key + r"\s*:\s*" + r_value


r_obj_rest = r"(\s*,\s*" + r_obj_key_pair + r"\s*)*"


def r_send_to_call(param):
    send_to = r"{(?P<conv_args>\s*['\"]send_to['\"]\s*:\s*" + param +\
        r_obj_rest + r"\s*)}"
    return r_conversion_call(send_to)


r_new_conversion_id = r_tag_fmt + r"/[a-zA-Z0-9\-_]+"

r_str_new_conversion = r_send_to_call(r"['\"]" + r_val(r_new_conversion_id) +
                                      r"['\"]")

r_global_gtag = re.compile(r_str_global)

r_new_conversion = re.compile(r_str_new_conversion)


class ScriptParameters(object):

    def __init__(self, conversion_id, conversion_language, conversion_format,
                 conversion_colour, conversion_label, conversion_value,
                 conversion_currency, remarketing_only, pixel_url):
        self.conversion_id = conversion_id
        self.conversion_language = conversion_language
        self.conversion_format = conversion_format
        self.conversion_colour = conversion_colour
        self.conversion_label = conversion_label
        self.conversion_value = conversion_value
        self.conversion_currency = conversion_currency
        self.remarketing_only = remarketing_only
        self.pixel_url = pixel_url


def get_group(regex, string):
    match = regex.search(string)
    if match is None:
        return None
    try:
        return match.group("value")
    except IndexError:
        return None


def extract_tracking_global_google_script_parameters(text):
    """ Extract the variable parameters from a global google analytics script.

        If the provided text appears to be of the correct format (see
        `format` above), return a gtag id.

        If the pattern is not matched, raise ScriptError with a message
        describing the problem.

        Dangerous or uncheckable constructs are not allowed. Whitespace is
        mostly ignored where reasonable, but full parsing is not done. E.G.
        javascript string escaping is not supported.

        The resulting values are safe to render directly into a javascript
        context (strings should be quoted, as in the pattern, but need not be
        escaped).
    """
    gtag_id = get_group(r_global_gtag, text)
    if gtag_id is None:
        raise ScriptError("could not find gtag id")
    return gtag_id


def extract_tracking_conversion_google_script_parameters(text):
    """ Extract the variable parameters from a new style conversion script.

        If the provided text appears to be of the correct format (see
        `format` above), return a gtag conversion id.

        If the pattern is not matched, raise ScriptError with a message
        describing the problem.

        Dangerous or uncheckable constructs are not allowed. Whitespace is
        mostly ignored where reasonable, but full parsing is not done. E.G.
        javascript string escaping is not supported.

        The resulting values are safe to render directly into a javascript
        context (strings should be quoted, as in the pattern, but need not be
        escaped).
    """
    match = r_new_conversion.search(text)
    if match is None:
        raise ScriptError("could not find conversation arguments")
    try:
        return match.group("conv_args")
    except IndexError:
        raise ScriptError("could not find conversion arguments")


def reconstitute_tracking_global_google_script(gtag_id):
    """ Render a tag id into a google tracking script string.

        Performs no escaping or validation -- dangerous or incorrect parameters
        should all already have been rejected at input time.
    """
    return global_script.format(gtag_id, gtag_id)


def reconstitute_tracking_conversion_google_script(extra_args, invoice=None):
    """ Render a tag id into a google convesion tracking script string.

        Performs no escaping or validation -- dangerous or incorrect parameters
        should all already have been rejected at input time.
    """
    conversion_currency = 'undefined'
    conversion_value = 'undefined'
    if invoice:
        conversion_currency = invoice.currency
        conversion_value = invoice.total_cost
    return conversion_script.format(conversion_currency, conversion_value,
                                    extra_args)
