<?php

require_once "rights.php";

const CAMEL = 1;
const UNDERSCORE = 2;
const VERSION_NUMBER = 6;

function camelize($word) {
    $word_array = explode("_", $word);
    $word_array = array_map("ucfirst", $word_array);
    $word_array[0] = strtolower($word_array[0]);
    return implode($word_array);
}

function snakelize($input) {
    return ltrim(strtolower(preg_replace('/[A-Z]([A-Z](?![a-z]))*/', '_$0', $input)), '_');
}

$function_dict = [CAMEL => "camelize", UNDERSCORE => "snakelize"];

function parse_json_key_names($json_object, $standard) {
    /*
       Convert the string value of key in json
       to a required standard. by the time this comment was written only
       camel and underscore were supported
     */
    if (is_array($json_object)){
        if ((bool)count(array_filter(array_keys($json_object), 'is_string'))){
            $old_keys = array_keys($json_object);
            global $function_dict;
            foreach ($old_keys as $old){
                $new = $function_dict[$standard]($old);
                if ($new != $old) {
                    $json_object[$new] = $json_object[$old];
                    unset($json_object[$old]);
                    parse_json_key_names($json_object[$new], $standard);
                } else {
                    parse_json_key_names($json_object[$old], $standard);
                }
            }
        } else {
            foreach ($json_object as $item) {
                parse_json_key_names($item, $standard);
            }
        }
    }
    return $json_object;
}

function parse_json_key_underscore($json_object) {
    return parse_json_key_names($json_object, UNDERSCORE);
}

function parse_json_key_camel($json_object) {
    return parse_json_key_names($json_object, CAMEL);
}

function empty_content($content) {
    return is_null($content);
}

function is_empty_json($json_object) {
    /*
       Check whether given json object has value
       by checking whether all the values in very key-value
       pair of json is None
     */
    $is_empty = true;
    if (is_array($json_object)) {
        if ((bool)count(array_filter(array_keys($json_object), 'is_string'))) {
            foreach ($json_object as $key => $value) {
                if ($key != "rights" and !is_empty_json($value)) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    if (!empty_content($json_object)) {
        return false;
    }
    return $is_empty;
}

function clean_empty_json($json_object) {
    /* Give a json which all empty sub-json are eliminated */
    $return_json = [];
    foreach ($json_object as $key => $value) {
       if (!is_empty_json($value)) {
           $return_json[$key] = $value;
       }
    }
    return $return_json;
}

function unpack_recursive_json_iter($json_object) {
    
    $return_json = [];
    $json_object = clean_empty_json($json_object);

    foreach ($json_object as $key => $value) {
        if ($key == Rights::$json_name) {
            continue;
        }
        if (is_array($value)) {
            if ((bool)count(array_filter(array_keys($json_object), 'is_string'))) {
                foreach ($value as $k => $v) {
                    $key_in_return_json = $key . "-0-" . $k;
                    $return_json[$key_in_return_json] = $v;
                }
                $count_key = $key . "-count";
                $return_json[$count_key] = 1;
            } else {
                $object_in_json_list = $value;
                $index = 0;
                foreach ($object_in_json_list as $object_in_json) {
                    if (is_array($object_in_json) &&
                        (bool)count(array_filter(array_keys($object_in_json), 'is_string'))) {
                        foreach ($object_in_json as $k => $v) {
                            $key_in_return_json = $key . "-" . (string)$index . "-". $k;
                            $return_json[$key_in_return_json] = $v;
                        }
                    } else {
                        $key_in_return_json = $key . "-" . (string)$index;
                        $return_json[$key_in_return_json] = $object_in_json;
                    }
                    ++$index;
                }
                $count_key = $key . "-count";
                $return_json[$count_key] = $index;
            }
        } else {
            $return_json[$key] = $value;
        }
    }
    return $return_json;
}

function is_json_flat($json_object) {
    foreach ($json_object as $item) {
        if (is_array($item)) {
            return false;
        }
    }
    return true;
}

function unpack_recursive_json($json_object) {
    while (!is_json_flat($json_object)) {
        $json_object = unpack_recursive_json_iter($json_object);
    }
    return $json_object;
}