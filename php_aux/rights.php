<?php

const ACCESS = 1;
const EDIT = 2;
const DELETE = 3;

const right_names = [ACCESS => "access",
               EDIT => "edit",
               DELETE => "delete"];

const ALL_RIGHTS = [ACCESS, EDIT, DELETE];


class Rights
{
    public static $json_name = 'rights';


    function __construct($right_codes = NULL)
    {
        if(!$right_codes){
            $right_codes = [];
        }
        $this->from_json($right_codes);
    }

    function to_array(){
        $return_codes = [];
        foreach(right_names as $key => $value){
            $whether_has_right = property_exists($this, $value)?
            $this->$value : False;
            if($whether_has_right){
              $return_codes[] = $key;
            }
        }
        return $return_codes;
    }

    function from_json($right_codes){
        foreach(right_names as $key => $value){
            if(in_array($key, $right_codes)){
                $this->$value = True;
            }else{
                $this->$value = False;
            }
        }
    }

    function mask($rights){
        foreach(right_names as $name){
            $this->$name = property_exists($this, $name) and
            property_exists($rights, $name)? $this->$name and $rights->$name:
            False;
        }
    }
}
