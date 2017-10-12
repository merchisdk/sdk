import flask


def check_target_is_safe(target):
    """ Make sure that the redirect is safe to prevent phishing attacks """
    dash = flask.request.url_root.find('/dashboard', 8)
    if target and not target.startswith(flask.request.url_root[:dash]):
        target = flask.url_for('dashboard')
    return target
