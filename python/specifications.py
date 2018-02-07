import copy
import sdk.python.entities
from sdk.python.files import File
from sdk.python.util.specification_field_type import SELECT, CHECKBOX, RADIO, \
    has_options_array, COLOUR_SELECT, FILE_UPLOAD


class SpecificationFieldOption(sdk.python.entities.Entity):

    resource = '/specification_field_options/'
    json_name = 'specification_field_option'

    def __init__(self):
        super(SpecificationFieldOption, self).__init__()
        self.escape_fields = ["default"]
        self.json_property(int, 'id')
        self.json_property(str, 'value')
        self.json_property(str, 'colour')
        self.json_property(int, 'position')
        self.json_property(float, 'specification_cost')
        self.json_property(float, 'specification_unit_cost')
        self.json_property(float, 'default')
        self.recursive_json_property(File, "linked_file")

    def apply_cost_per_unit(self):
        """ Return True if the option cost is applied per unit """
        return self.specification_unit_cost is not None


class SpecificationField(sdk.python.entities.Entity):

    resource = '/specification_fields/'
    json_name = 'specification_field'

    def is_empty(self):
        """ Override is empty field validation if the field type required
            and name have not been touched and name is empty
        """
        return not self.name and not self.required and not self.options

    def __init__(self):
        super(SpecificationField, self).__init__()
        self.escape_fields = ['field_type', 'required', 'specification_cost']
        self.json_property(int, 'id')
        self.json_property(int, 'field_type')
        self.json_property(int, 'position')
        self.json_property(int, 'rows')
        self.json_property(int, 'field_min')
        self.json_property(int, 'field_max')
        self.json_property(bool, 'required')
        self.json_property(bool, 'independent')
        self.json_property(bool, 'show_file_preview')
        self.json_property(bool, 'allow_decimal')
        self.json_property(bool, 'allow_file_multiple')
        self.json_property(bool, 'allow_file_jpeg')
        self.json_property(bool, 'allow_file_gif')
        self.json_property(bool, 'allow_file_pdf')
        self.json_property(bool, 'allow_file_png')
        self.json_property(bool, 'allow_file_ai')
        self.json_property(bool, 'multiple_select')
        self.json_property(str, 'name')
        self.json_property(str, 'default_value')
        self.json_property(str, 'placeholder')
        self.json_property(float, 'specification_cost')
        self.json_property(float, 'specification_unit_cost')
        self.json_property(float, 'cost')
        self.recursive_json_property(SpecificationFieldOption,
                                     "options")
        self.recursive_json_property(SpecificationFieldOption,
                                     "default_options")

    def is_select(self):
        return self.field_type == SELECT

    def is_select_type(self):
        return self.field_type in {SELECT, RADIO}

    def is_file_upload(self):
        return self.field_type == FILE_UPLOAD

    def is_default_multi_select(self):
        return self.field_type == CHECKBOX

    def is_radio_or_checkbox(self):
        return self.field_type in {RADIO, CHECKBOX}

    def has_options(self):
        return self.field_type in has_options_array

    def is_colour_select(self):
        return self.field_type == COLOUR_SELECT

    def build_empty_specification(self):
        specification_built = Specification()
        specification_built.once_off_cost = 0
        specification_built.value = ""
        if self.field_type == CHECKBOX:
            specification_built.value = []
            for option in self.options:
                if option.default:
                    specification_built.value.append(option.id)
                    specification_built.once_off_cost +=\
                        option.specification_cost
            specification_built.value = \
                ",".join(str(value) for value in specification_built.value)
        elif self.field_type in (SELECT, RADIO):
            for option in self.options:
                if option.default:
                    specification_built.value = str(option.id)
                    specification_built.once_off_cost = \
                        option.specification_cost
                    break
        else:
            specification_built.value = self.default_value
            specification_built.once_off_cost = self.specification_cost
        specification_built.unit_cost_total = 0
        specification_built.cost = specification_built.once_off_cost
        specification_built.specification_field = copy.deepcopy(self)
        return specification_built


class SpecificationOption(sdk.python.entities.Entity):
    json_name = 'specification_option'

    def __init__(self):
        super(SpecificationOption, self).__init__()
        self.json_property(int, 'option_id')
        self.json_property(int, 'quantity')
        self.json_property(str, 'value')
        self.json_property(str, 'colour')
        self.json_property(str, 'field_name')
        self.json_property(float, 'once_off_cost')
        self.json_property(float, 'unit_cost')
        self.json_property(float, 'unit_cost_total')
        self.json_property(float, 'total_cost')


class Specification(sdk.python.entities.Entity):

    resource = '/specifications/'
    json_name = 'specification'

    def __init__(self):
        super(Specification, self).__init__()
        self.json_property(int, 'id')
        self.json_property(int, 'quantity')
        self.json_property(str, 'value')
        self.json_property(float, 'cost')
        self.json_property(float, 'once_off_cost')
        self.json_property(float, 'unit_cost')
        self.json_property(float, 'unit_cost_total')
        self.recursive_json_property(SpecificationOption, 'selected_options')
        self.recursive_json_property(File, 'specification_files')
        self.recursive_json_property(SpecificationField,
                                     "specification_field")

    def is_selectable(self):
        """ Returns True if the field type is selectable """
        return self.specification_field.field_type in has_options_array

    def is_file_upload(self):
        """ Returns True if is a file upload type """
        return self.specification_field.is_file_upload()

    def has_multiple_files(self):
        """ Returns True if the specification has multiple files """
        if self.specification_files:
            return len(self.specification_files) > 0
        return False

    def is_colour_select(self):
        return self.specification_field.is_colour_select()

    def selected_colour_option(self):
        """ Returns the first selected option """
        return self.selected_options[0]

    def has_options(self):
        return self.specification_field.field_type in has_options_array

    def value_array(self, new_values_array=None):
        """ Return an array of the specification values and if new_values_array
            is provided update the value attribute to match the
            new_values_array argument
        """
        if self.value:
            if new_values_array:
                self.value = ','.join(new_values_array)
            return [n for n in self.value.split(',')]
        return []

    def get_selected_option(self, option_id):
        """ Return the specification option which matches the option_id
            argument
        """
        for option in self.specification_field.options:
            if int(option_id) == option.id:
                return option
        return None

    def selected_options_array(self):
        """ Returns an array of selected options """
        values = self.value_array()
        if self.is_selectable():
            return [self.get_selected_option(int(v)) for v in values]
        return []

    def first_selected_option(self):
        """ Return an option if the option id is equal to the
            specification value.
        """
        if len(self.value_array()) > 0:
            return self.selected_options_array()[0]
        return None

    def value_string(self, option_id=None):
        """ Check to see if the specification has options and if an option_id
            has been provided and return that option value if so. If no option
            value is provided return the first option
        """
        if self.specification_field.has_options():
            option = self.first_selected_option()
            if option and option_id:
                option = self.get_selected_option(option_id)
                return option.value
        return self.value

    def link_to_field(self, fields):
        for field in fields:
            if int(self.specification_field.id) == int(field.id):
                self.specification_field = field


class SpecificationsGroup(sdk.python.entities.Entity):

    resource = "/specifications_groups/"
    json_name = "specifications_group"

    def __init__(self):
        super(SpecificationsGroup, self).__init__()
        self.json_property(int, 'id')
        self.json_property(int, 'quantity')
        self.json_property(float, 'group_cost')
        self.recursive_json_property(Specification,
                                     "specifications")

    def link_to_fields(self, fields):
        for specification in self.specifications:
            specification.link_to_field(fields)
