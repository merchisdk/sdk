import werkzeug


def get_file_content(request_file_stream):
    """ Read the whole content of file stream in flask.request.files,
        and move the file pointer of the file stream to the beginning.
    """
    request_file_stream.stream.seek(0)
    content = request_file_stream.read()
    request_file_stream.stream.seek(0)
    return content


def generate_file_storage(io_stream, name, type):
    """ Generate file storage from IO stream """
    return werkzeug.datastructures.FileStorage(io_stream,
                                               filename=name,
                                               content_type=type)
