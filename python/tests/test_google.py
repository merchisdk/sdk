from sdk.python.util.google import reconstitute_tracking_conversion_google_script


def test_reconstitute_tracking_conversion_google_script():
    result = reconstitute_tracking_conversion_google_script(
        "'send_to': '1'"
    )
    assert "'send_to': '1'" in result
