from unittest.mock import patch

import stripe

from sdk.python.util.stripe_util import is_valid_key


def test_empty_key_is_invalid():
    assert is_valid_key(None) is False
    assert is_valid_key("") is False


def test_publishable_key_is_invalid():
    assert is_valid_key("pk_test_abc") is False
    assert is_valid_key("pk_live_abc") is False


@patch("sdk.python.util.stripe_util.stripe.Charge.list")
def test_valid_secret_key(mock_list):
    mock_list.return_value = []
    assert is_valid_key("sk_test_abc") is True
    mock_list.assert_called_once_with(limit=1)


@patch("sdk.python.util.stripe_util.stripe.Charge.list")
def test_authentication_error_is_invalid(mock_list):
    mock_list.side_effect = stripe.error.AuthenticationError("bad key")
    assert is_valid_key("sk_test_bad") is False


@patch("sdk.python.util.stripe_util.stripe.Charge.list")
def test_permission_error_is_invalid(mock_list):
    mock_list.side_effect = stripe.error.PermissionError("no charges")
    assert is_valid_key("rk_test_limited") is False
