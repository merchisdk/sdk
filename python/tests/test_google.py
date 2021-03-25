from sdk.python.util.google import extract_script_parameters
from sdk.python.util.google import reconstitute_conversion_script
from sdk.python.util.google import reconstitute_new_conversion_script


def test_can_extract_google_conversion_parameters():
    script_format = """
<script type="text/javascript">
/* <![CDATA[ */
var google_conversion_id = 33;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "ffffff";
var google_conversion_label = "jllkj";
var google_conversion_value = 30.20;
var google_conversion_currency = "AUD";
var google_remarketing_only = true;
/* ]]> */
</script>
<script type="text/javascript"
    src="//www.googleadservices.com/pagead/conversion.js">
</script>
<noscript>
<div style="display:inline;">
<img height="1" width="1" style="border-style:none;" alt="" """
    script_format += 'src="//www.googleadservices.com/pagead/conversion/'
    script_format += '23234234/"/> </div> </noscript>'
    reconstitute_conversion_script(extract_script_parameters(script_format))


def test_reconstitute_new_conversion_script():
    result = reconstitute_new_conversion_script(1)
    assert "'send_to': '1'," in result
