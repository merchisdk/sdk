from sdk.python.sessions import Session
from sdk.python.request import Request


def test_empty_session_will_not_generate_post_data():
    session = Session()
    data_json, _ = session.serialise(consider_rights=False)
    assert data_json == {'token': None}
    request = Request()
    request.data = data_json
    assert request.get_data_post() is None
