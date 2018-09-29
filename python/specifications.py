import copy
import sdk.python.entities
from sdk.python.entities import Property
from sdk.python.files import File
from sdk.python.util.specification_field_type import SELECT, CHECKBOX, RADIO, \
    has_options_array, COLOUR_SELECT, FILE_UPLOAD


class SpecificationFieldOption(sdk.python.entities.Entity):

    resource = '/specification_field_options/'
    json_name = 'specification_field_option'

    def __init__(self):
        super(SpecificationFieldOption, self).__init__()
        self.escape_fields = ["default"]

    id = Property(int)
    value = Property(str)
    colour = Property(str)
    position = Property(int)
    specification_cost = Property(float)
    specification_unit_cost = Property(float)
    default = Property(float)
    linked_file = Property(File)

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
    id = Property(int)
    field_type = Property(int)
    position = Property(int)
    rows = Property(int)
    field_min = Property(int)
    field_max = Property(int)
    required = Property(bool)
    independent = Property(bool)
    show_file_preview = Property(bool)
    allow_decimal = Property(bool)
    allow_file_multiple = Property(bool)
    allow_file_jpeg = Property(bool)
    allow_file_gif = Property(bool)
    allow_file_pdf = Property(bool)
    allow_file_png = Property(bool)
    allow_file_ai = Property(bool)
    multiple_select = Property(bool)
    name = Property(str)
    default_value = Property(str)
    placeholder = Property(str)
    specification_cost = Property(float)
    specification_unit_cost = Property(float)
    cost = Property(float)
    options = Property(SpecificationFieldOption)
    default_options = Property(SpecificationFieldOption)

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

    option_id = Property(int)
    quantity = Property(int)
    value = Property(str)
    colour = Property(str)
    field_name = Property(str)
    once_off_cost = Property(float)
    unit_cost = Property(float)
    unit_cost_total = Property(float)
    total_cost = Property(float)


class Specification(sdk.python.entities.Entity):

    resource = '/specifications/'
    json_name = 'specification'

    id = Property(int)
    quantity = Property(int)
    value = Property(str)
    cost = Property(float)
    once_off_cost = Property(float)
    unit_cost = Property(float)
    unit_cost_total = Property(float)
    selected_options = Property(SpecificationOption)
    specification_files = Property(File)
    specification_field = Property(SpecificationField)

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

    id = Property(int)
    quantity = Property(int)
    group_cost = Property(float)
    specifications = Property(Specification)

    def link_to_fields(self, fields):
        for specification in self.specifications:
            specification.link_to_field(fields)
