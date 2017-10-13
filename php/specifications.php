<?php

require_once 'entity.php';
require_once 'files.php';

class SpecificationFieldOption extends Entity
{
    public static $resource = '/specification_field_options/';
    public static $json_name = 'specification_field_option';

    public function __construct()
    {
        $this->escape_fields = ["default"];
        $this->json_property('id','integer');
        $this->json_property('value','string');
        $this->json_property('colour','string');
        $this->json_property('position','integer');
        $this->json_property('specification_cost','float');
        $this->json_property('specification_unit_cost','float');
        $this->json_property('default','float');
        $this->json_property('linked_file', 'File', $many = False,
                             $recursive = True);
    }

    public function apply_cost_per_unit(){
        # Return True if the option cost is applied per unit
        return is_null($this->specification_unit_cost);
    }
}

class SpecificationField extends Entity
{
    public static $resource = '/specification_fields/';
    public static $json_name = 'specification_field';

    public function is_empty(){
         return is_null($this->name) and is_null($this->required) and is_null($this->options);
    }

    public function __construct()
    {
        $this->escape_fields = ["field_type", 'required', 'specification_cost'];
        $this->json_property('id','integer');
        $this->json_property('field_type','integer');
        $this->json_property('position','integer');
        $this->json_property('rows','integer');
        $this->json_property('field_min','integer');
        $this->json_property('field_max','integer');

        $this->json_property('required','boolean');
        $this->json_property('independent','boolean');
        $this->json_property('show_file_preview','boolean');
        $this->json_property('allow_decimal','boolean');
        $this->json_property('allow_file_multiple','boolean');
        $this->json_property('allow_file_jpeg','boolean');
        $this->json_property('allow_file_gif','boolean');
        $this->json_property('allow_file_pdf','boolean');
        $this->json_property('allow_file_png','boolean');
        $this->json_property('allow_file_ai','boolean');
        $this->json_property('multiple_select','boolean');

        $this->json_property('name','string');
        $this->json_property('default_value','string');
        $this->json_property('placeholder','string');
        $this->json_property('specification_cost','float');
        $this->json_property('specification_unit_cost','float');
        $this->json_property('cost','float');
        $this->json_property('options', 'SpecificationFieldOption', $many = True,
                             $recursive = True);
        $this->json_property('default_options', 'SpecificationFieldOption', $many = True,
                             $recursive = True);
    }
}

class SpecificationOption extends Entity
{
    public static $json_name = 'specification_option';

    public function __construct()
    {
        $this->json_property('option_id','integer');
        $this->json_property('quantity','integer');
        $this->json_property('value','string');
        $this->json_property('colour','string');
        $this->json_property('field_name','string');
        $this->json_property('once_off_cost','float');
        $this->json_property('unit_cost','float');
        $this->json_property('unit_cost_total','float');
        $this->json_property('total_cost','float');
    }
}

class Specification extends Entity
{
    public static $json_name = 'specification';
    public static $resource = '/specifications/';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('quantity','integer');
        $this->json_property('value','string');
        $this->json_property('once_off_cost','float');
        $this->json_property('unit_cost','float');
        $this->json_property('unit_cost_total','float');
        $this->json_property('cost','float');
        $this->json_property('selected_options', 'SpecificationOption', $many = True,
                             $recursive = True);
        $this->json_property('specification_files', 'File', $many = True,
                             $recursive = True);
        $this->json_property('specification_field', 'SpecificationField', $many = False,
                             $recursive = True);
    }
}

class SpecificationsGroup extends Entity
{
    public static $json_name = 'specifications_group';
    public static $resource = '/specifications_groups/';

    public function __construct()
    {
        $this->json_property('id','integer');
        $this->json_property('quantity','integer');
        $this->json_property('group_cost','float');
        $this->json_property('specifications', 'Specification', $many = True,
                             $recursive = True);
    }
}
