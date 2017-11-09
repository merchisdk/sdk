<?php

require_once 'entity.php';
require_once 'files.php';
require_once './../php_aux/specification_field_type.php';

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
         return is_null($this->name) and is_null($this->required)
                and is_null($this->options);
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
        $this->json_property('options', 'SpecificationFieldOption',
                              $many = True, $recursive = True);
        $this->json_property('default_options', 'SpecificationFieldOption',
                              $many = True, $recursive = True);
    }

    public function is_select(){
        return $this->field_type == SELECT;
    }

    public function is_select_type(){
        return in_array($this->field_type, [SELECT, RADIO]);
    }

    public function is_file_upload(){
        return $this->field_type == FILE_UPLOAD;
    }

    public function is_default_multi_select(){
        return $this->field_type == CHECKBOX;
    }

    public function is_radio_or_checkbox(){
        return in_array($this->field_type, [RADIO, CHECKBOX]);
    }

    public function has_options(){
        return in_array($this->field_type, has_options_array);
    }

    public function is_colour_select(){
        return $this->field_type == COLOUR_SELECT;
    }

    public function build_empty_specification(){
        $specification_built = new Specification();
        $specification_built->once_off_cost = 0;
        $specification_built->value = "";
        if($this->field_type == CHECKBOX){
            $specification_built->value = [];
            foreach($this->options as $option){
                if($option->default){
                    $specification_built->value[] = (string)$option->id;
                    $specification_built->once_off_cost +=
                    $option->specification_cost;
                }
            }
            unset($option);
            $specification_built->value =
            implode(",", $$specification_built->value);
        }
        elseif (in_array($this->field_type, [SELECT,RADIO])) {
            foreach($this->options as $option){
                if($option->default){
                    $specification_built->value = (string)$option->id;
                    $specification_built->once_off_cost +=
                    $option->specification_cost;
                    break;
                }
            }
        }
        else {
            $specification_built->value = $this->default_value;
            $specification_built->once_off_cost = $this->specification_cost;
        }
        $specification_built->unit_cost_total = 0;
        $specification_built->cost = $specification_built->once_off_cost;
        //NOTE:To do a deep copy,unserialize a serialized object is an extremly
        //resource-consuming method.Should get rid of it latter on.
        $specification_built->specification_field =
                        unserialize(serialize($this));
        return $specification_built;
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
        $this->json_property('selected_options', 'SpecificationOption',
                              $many = True, $recursive = True);
        $this->json_property('specification_files', 'File', $many = True,
                             $recursive = True);
        $this->json_property('specification_field', 'SpecificationField',
                              $many = False, $recursive = True);
    }

    public function is_selectable(){
        #Returns True if the field type is selectable
        return in_array($this->specification_field->field_type,
                        has_options_array);
    }

    public function is_file_upload(){
        #Returns True if is a file upload type
        return $this->specification_field->is_file_upload();
    }

    public function has_muiltiple_files(){
        #Returns True if the specification has multiple files
        if($this->specification_files){
            return sizeof($this->specification_files) > 0;
        }
        return False;
    }

    public function is_colour_select(){
        return $this->specification_field->is_colour_select();
    }

    public function selected_colour_option(){
        #Returns the first selected option
        return $this->selected_options[0];
    }

    public function has_options(){
        return in_array($this->specification_field->field_type,
                        has_options_array);
    }

    public function value_array($new_values_array = null){
        /*Return an array of the specification values and if new_values_array
            is provided update the value attribute to match the
            new_values_array argument
        */
        if($this->value){
            if($new_values_array){
                $this->value = implode(",", $new_values_array);
            }
            return explode(",", $this->value);
        }
        return [];
    }

    public function get_selected_option($option_id){
        #Return the specification option which matches the option_id argument
        foreach($this->specification_field->options as $option){
            if((int)$option_id ==  $option->id){
                return $option;
            }
        }
        return null;
    }

    public function selected_options_array(){
        #Returns an array of selected options
        $values = $this->value_array();
        if($this->is_selectable()){
            $return_array = [];
            foreach($values as $val){
                $return_array[] = $this->get_selected_option((int)$val);
            }
            unset($val);
            return $return_array;
        }
        return [];
    }

    public function first_selected_option(){
        /*Return an option if the option id is equal to the
            specification value.
        */
        if(sizeof($this->value_array()) > 0){
            return $this->selected_options_array()[0];
        }
        return null;
    }

    public function value_string($option_id = null){
        /*Check to see if the specification has options and if an option_id
            has been provided and return that option value if so. If no option
            value is provided return the first option
        */
        if($this->specification_field->has_options()){
            $option = $this->first_selected_option();
            if($option and $option_id){
                $option = $this->get_selected_option($option_id);
                return $option->value;
            }
        }
        return $this->value;
    }

    public function link_to_field($fields){
        foreach($fields as $field){
            if((int)$this->specification_field->id == (int)$field->id){
                $this->specification_field = $field;
            }
        }
        unset($field);
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

    public function link_to_fields($fields){
        foreach($this->specifications as $specification){
            $specification->link_to_field($fields);
        }
    }
}
