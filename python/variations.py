import copy
import sdk.python.entities
from sdk.python.discount_groups import DiscountGroup
from sdk.python.entities import Property
from sdk.python.files import File
from sdk.python.util.variation_field_type import SELECT, CHECKBOX, RADIO, \
    has_options_array, COLOUR_SELECT, FILE_UPLOAD


class VariationFieldOption(sdk.python.entities.Entity):

    resource = '/variation_field_options/'
    json_name = 'variation_field_option'

    def __init__(self):
        super(VariationFieldOption, self).__init__()
        self.escape_fields = ["default"]

    id = Property(int)
    value = Property(str)
    colour = Property(str)
    currency = Property(str)
    position = Property(int)
    variation_cost = Property(float)
    variation_cost_discount_group = Property(DiscountGroup)
    variation_unit_cost = Property(float)
    variation_unit_cost_discount_group = Property(DiscountGroup)
    default = Property(bool)
    include = Property(bool)
    no_inventory = Property(bool)
    linked_file = Property(File)
    buy_unit_cost = Property(float)
    buy_cost = Property(float)

    def apply_cost_per_unit(self):
        """ Return True if the option cost is applied per unit """
        return self.variation_unit_cost is not None

    def build_variation_option(self):
        result = VariationOption()
        result.optionId = self.id
        result.value = self.value
        result.position = self.position
        result.default = self.default
        result.colour = self.colour
        result.linked_file = self.linked_file
        result.quantity = 0  # type: ignore

        result.currency = self.currency
        result.unit_cost = self.variation_unit_cost
        result.unit_cost_total = 0  # type: ignore
        result.once_off_cost = self.variation_cost
        result.total_cost = self.variation_cost
        return result


class VariationField(sdk.python.entities.Entity):

    resource = '/variation_fields/'
    json_name = 'variation_field'

    def is_empty(self):
        """ Override is empty field validation if the field type required
            and name have not been touched and name is empty
        """
        return not self.name and not self.required and not self.options

    def __init__(self):
        super(VariationField, self).__init__()
        self.escape_fields = ['field_type', 'required', 'variation_cost']
    id = Property(int)
    field_type = Property(int)
    position = Property(int)
    rows = Property(int)
    field_min = Property(int)
    field_max = Property(int)
    required = Property(bool)
    seller_product_editable = Property(bool)
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
    variation_cost = Property(float)
    variation_cost_discount_group = Property(DiscountGroup)
    inventory_group = Property(
        "sdk.python.inventory_groups.InventoryGroup")
    linked_inventory_group = Property(
        "sdk.python.inventory_groups.InventoryGroup")
    variation_unit_cost = Property(float)
    variation_unit_cost_discount_group = Property(DiscountGroup)
    cost = Property(float)
    margin = Property(float)
    options = Property(VariationFieldOption)
    default_options = Property(VariationFieldOption)
    buy_unit_cost = Property(float)
    buy_cost = Property(float)

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

    def build_empty_variation(self):
        variation_built = Variation()
        variation_built.once_off_cost = 0  # type: ignore
        variation_built.value = ""  # type: ignore
        variation_built.selectable_options = []  # type: ignore
        if self.field_type == CHECKBOX:
            variation_built.value = []  # type: ignore
            for option in self.options:
                if option.default:
                    variation_built.value.append(option.id)
                    variation_built.once_off_cost +=\
                        option.variation_cost
                variation_built.selectable_options.append(
                    option.build_variation_option)
            values = (str(value) for value in variation_built.value)
            variation_built.value = ",".join(values)  # type: ignore
        elif self.field_type in (SELECT, RADIO):
            variation_built.selectable_options.append(
                option.build_variation_option)
            for option in self.options:
                if option.default:
                    variation_built.value = str(option.id)  # type: ignore
                    variation_built.once_off_cost = \
                        option.variation_cost
                    break
        else:
            variation_built.value = self.default_value
            variation_built.once_off_cost = self.variation_cost
        variation_built.unit_cost_total = 0  # type: ignore
        variation_built.cost = variation_built.once_off_cost
        variation_built.variation_field = copy.deepcopy(self)
        return variation_built


class VariationOption(sdk.python.entities.Entity):
    json_name = 'variation_option'

    option_id = Property(int)
    quantity = Property(int)
    available = Property(bool)
    value = Property(str)
    colour = Property(str)
    field_name = Property(str)
    currency = property(str)
    once_off_cost = Property(float)
    unit_cost = Property(float)
    unit_cost_total = Property(float)
    total_cost = Property(float)
    position = Property(int)
    default = Property(bool)
    include = Property(bool)
    linked_file = Property(File)


class Variation(sdk.python.entities.Entity):

    resource = '/variations/'
    json_name = 'variation'

    id = Property(int)
    quantity = Property(int)
    value = Property(str)
    currency = Property(str)
    cost = Property(float)
    once_off_cost = Property(float)
    unit_cost = Property(float)
    unit_cost_total = Property(float)
    selected_options = Property(VariationOption)
    selectable_options = Property(VariationOption)
    variation_files = Property(File)
    variation_field = Property(VariationField)

    def is_selectable(self):
        """ Returns True if the field type is selectable """
        return self.variation_field.field_type in has_options_array

    def is_file_upload(self):
        """ Returns True if is a file upload type """
        return self.variation_field.is_file_upload()

    def has_multiple_files(self):
        """ Returns True if the variation has multiple files """
        if self.variation_files:
            return len(self.variation_files) > 0
        return False

    def is_colour_select(self):
        return self.variation_field.is_colour_select()

    def selected_colour_option(self):
        """ Returns the first selected option """
        return self.selected_options[0]

    def has_options(self):
        return self.variation_field.field_type in has_options_array

    def value_array(self, new_values_array=None):
        """ Return an array of the variation values and if new_values_array
            is provided update the value attribute to match the
            new_values_array argument
        """
        if self.value:
            if new_values_array:
                self.value = ','.join(new_values_array)  # type: ignore
            return self.value.split(',')
        return []

    def get_selected_option(self, option_id):
        """ Return the variation option which matches the option_id
            argument
        """
        for option in self.variation_field.options:
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
            variation value.
        """
        if len(self.value_array()) > 0:
            return self.selected_options_array()[0]
        return None

    def value_string(self, option_id=None):
        """ Check to see if the variation has options and if an option_id
            has been provided and return that option value if so. If no option
            value is provided return the first option
        """
        if self.variation_field.has_options():
            option = self.first_selected_option()
            if option and option_id:
                option = self.get_selected_option(option_id)
                return option.value
        return self.value

    def link_to_field(self, fields):
        for field in fields:
            if int(self.variation_field.id) == int(field.id):
                self.variation_field = field


class VariationsGroup(sdk.python.entities.Entity):

    resource = "/variations_groups/"
    json_name = "variations_group"

    id = Property(int)
    quantity = Property(int)
    group_cost = Property(float)
    variations = Property(Variation)

    # not embedded by default, must be requested
    inventoryCount = Property(int)
    inventory_sufficient = Property(bool)

    def link_to_fields(self, fields):
        for variation in self.variations:
            variation.link_to_field(fields)
