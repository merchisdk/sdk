LEGAL_SUFFIX = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'docx', 'doc']

PIC_SUFFIX = ['pdf', 'png', 'jpg', 'jpeg', 'gif']

TRUE_INPUTS = {'y', 'yes', 'true', '1', 'on', 'True', 1, True}

FALSE_INPUTS = {'n', 'no', 'false', '0', 'off', 'False', 0, False}


def is_legal_suffix(filename):
    """ Return True if the file extension matches one of the common document
        or image formats that we expect to allow (listed above).
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in LEGAL_SUFFIX


def is_pic_suffix(filename):
    """ Return True if the file extension of the given filename matches one
        that we expect for an image file, otherwise False.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in PIC_SUFFIX


def is_true_string(string):
    """ Return True if the string is in the TRUE_INPUTS """
    return string in TRUE_INPUTS


def is_legal_theme_file_mimetype(mimetype):
    return mimetype in {'image/bmp',
                        'image/gif',
                        'image/jpeg',
                        'image/png',
                        'image/tiff',
                        'image/webp',
                        'image/x-icon',
                        'image/x-pcx',
                        'image/x-pict',
                        'application/font-woff',
                        'application/x-font-woff',
                        'application/font-woff2',
                        'application/x-font-woff',
                        'application/font-sfnt',
                        'application/x-font-sfnt',
                        'application/font-opentype',
                        'application/x-font-opentype',
                        'application/font-ttf',
                        'font/ttf',
                        'application/octet-stream',
                        'application/x-font-ttf',
                        'application/font-truetype',
                        'application/x-font-truetype',
                        'application/x-font-truetype'}
