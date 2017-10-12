import base64


def data_url_from_bytes(byte_string, mimetype='image/png'):
    encoded = str(base64.b64encode(byte_string))[2:-1]
    return 'data:{};base64,{}'.format(mimetype, encoded)
