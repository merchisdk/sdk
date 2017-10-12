ACCESS = 1
EDIT = 2
DELETE = 3

right_names = {ACCESS: "access",
               EDIT: "edit",
               DELETE: "delete"}

ALL_RIGHTS = [ACCESS, EDIT, DELETE]


class Rights(object):

    json_name = "rights"

    def __init__(self, right_codes=None):
        if not right_codes:
            right_codes = []
        self.from_json(right_codes)

    def to_dict(self):
        """ Return a list representation of the rights represented by this
            object, which may be converted to a JSON string.
        """
        return_codes = []
        for code, name in right_names.items():
            whether_has_right = getattr(self, name, False)
            if whether_has_right is True:
                return_codes.append(code)
        return return_codes

    def from_json(self, right_codes):
        """ Parse json specification of rights given in right_codes and set
            this object to match the given specification. Returns None.
        """
        for code, name in right_names.items():
            if code in right_codes:
                setattr(self, name, True)
            else:
                setattr(self, name, False)

    def mask(self, rights):
        """ Mask the current rights of the given rights, which means remove
            the permission of current rights object if parameter rights does
            not have that permission.
            eg: current_rights is [ACCESS, EDIT]
                parameter_rights is [EDIT, DELETE]
                after call current_rights.mask(parameter_rights)
                current_rights will be [ACCESS]
        """
        for _, name in right_names.items():
            setattr(self, name,
                    (getattr(self, name, False) and
                     getattr(rights, name, False)))
