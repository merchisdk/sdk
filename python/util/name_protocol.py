import inflection
import sdk.python.util.rights

CAMEL = 1
UNDERSCORE = 2
VERSION_NUMBER = 6


def camelize(word):
    return inflection.camelize(word, uppercase_first_letter=False)


function_dict = {CAMEL: camelize,
                 UNDERSCORE: inflection.underscore}


def plural_to_singular(word):
    return inflection.singularize(word)


def singular_to_plural(word):
    return inflection.pluralize(word)


def parse_json_key_names(json_object, standard):
    """ Convert the string value of key in json
       to a required standard. by the time this comment was written only
       camel and underscore were supported
    """
    if isinstance(json_object, dict):

        old_keys = list(json_object.keys())
        for old in old_keys:
            new = function_dict[standard](old)
            if new != old:
                json_object[new] = json_object[old]
                del json_object[old]
                parse_json_key_names(json_object[new], standard)
            else:
                parse_json_key_names(json_object[old], standard)

    elif isinstance(json_object, list):
        for item in json_object:
            parse_json_key_names(item, standard)

    return json_object


def parse_json_key_underscore(json_object):
    return parse_json_key_names(json_object, UNDERSCORE)


def parse_json_key_camel(json_object):
    return parse_json_key_names(json_object, CAMEL)


def is_empty_json(json_object):
    """Check whether given json object has value
       by checking whether all the values in very key-value
       pair of json is None
    """
    is_empty = True
    if isinstance(json_object, list):
        return False
    elif isinstance(json_object, dict):
        for key, value in json_object.items():
            if key != "rights" and is_empty_json(value) is False:
                return False
    else:
        if not empty_content(json_object):
            return False
    return is_empty


def clean_empty_json(json_object):
    """Give a json which all the empty sub-json
       are eliminated
    """
    return_json = {}
    for key, value in json_object.items():
        if not is_empty_json(value):
            return_json[key] = value
    return return_json


def unpack_recursive_json_iter(json_object, version):
    """Change nested json to a flat json
       by using a following rule:
           {users:{person:james}} =>
           {users-0-person:james, users-count: 1}
           {users:[b,c]} => {users-count:2, users-0:b, users-1:c }
           so a combined example may be
           {users:[{name:james},{name:daniel}]} =>
           {users-count:2, users-0-name:james, users-1-name:daniel}
    """
    return_json = {}
    json_object = clean_empty_json(json_object)

    def key_process(key):
        if version < 4:
            return plural_to_singular(key)
        return key

    for key, value in json_object.items():
        if key == sdk.python.util.rights.Rights.json_name:
            continue
        # if the value is a list of objects
        if isinstance(value, list):
            object_in_json_list = value
            index = 0
            for object_in_json in object_in_json_list:
                if isinstance(object_in_json, dict):
                    for k, v in object_in_json.items():
                        key_in_return_json = key_process(key) + "-" +\
                            str(index) + "-" + k
                        return_json[key_in_return_json] = v
                else:
                    key_in_return_json = key_process(key) + "-" +\
                        str(index)
                    return_json[key_in_return_json] = object_in_json
                index += 1
            count_key = key_process(key) + "-count"
            return_json[count_key] = index
        elif isinstance(value, dict):
            for k, v in value.items():
                key_in_return_json = key_process(key) + "-0-" + k
                return_json[key_in_return_json] = v
            count_key = key_process(key) + "-count"
            return_json[count_key] = 1
        else:
            return_json[key] = value
    return return_json


def is_json_flat(json_object):
    for value in list(json_object.values()):
        if isinstance(value, (dict, list)):
            return False
    return True


def multidict_to_json(multidict):
    """ Return the dictionary version of the flask multidict """
    return dict((key, multidict.getlist(key)
                 if len(multidict.getlist(key)) > 1 else multidict.get(key))
                for key in multidict.keys())


def unpack_recursive_json(json_object, version_number):
    while not is_json_flat(json_object):
        json_object = unpack_recursive_json_iter(json_object, version_number)
    return json_object


def empty_content(content):
    return content is None


def encode_backend_data(data_dict):
    """ Encode a python dictionary to be sent to a backend view """
    data_json = parse_json_key_camel(data_dict)
    return unpack_recursive_json(data_json, VERSION_NUMBER)
