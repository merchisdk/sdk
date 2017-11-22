<?php

require_once 'http.php';
require_once 'utility.php';
require_once './../php_aux/rights.php';
require_once './../php_aux/name_protocol.php';

function enumerate_files($files){
    $n = 0;
    $result = [];
    foreach($files as $element){
        $result["$n"] = $element;
        ++$n;
    }
    return $result;
}

function generate_request($data,$files, $email = null, $password = null, $api_secret,
                           $query, $embed, $as_domain = null) {
    $request = new Request();
    $request->data = $data;
    $request->username = $email;
    $request->password = $password;
    return $request;
}

function check_response($response) {
    if ($response->status_code < 199 || $response->status_code > 299)
    {
        $body = json_decode($response->body, true);
        $message = $body['message'];
        throw new Exception($message);
    }
    return True;
}

class Entity
{
    public static $primary_key = 'id';
    public $file_data = [];
    public $json_properties = [];

    public $escape_fields = [];
    public $url_fields = [];
    /*
     if it is set to True the entity should only be treat as a reference to the backend entity
    */
    public $only_for_reference = False;

    public function __construct() {
        $this->rights = new Rights(ALL_RIGHTS);
    }

    public function send_to_entity($request, $identifier) {
        $request->resource = $this::$resource . $identifier . '/';
        return $request->send();
    }

    public function get($identifier, $embed = null) {
        $request = new Request();
        $request->query['embed'] = $embed;
        $response = $this->send_to_entity($request, $identifier);
        check_response($response);
        $body = json_decode($response->body, true);
        $this->from_json($body);
    }

    public function delete($identifier, $as_domain = null) {
        $request = new Request();
        $request->as_domain = $as_domain;
        $request->method = 'DELETE';
        return $this->send_to_entity($request, $identifier);
    }

    public function destroy() {
        list($_, $status) = $this->delete($this->primary_value());
        if ($status != 204) {
            throw new Exception('could not destroy object.');
        }
    }

    public function create($email = null, $password = null) {
        list($data, $files) = $this->serialise();
        $request = generate_request($data, $email, $password);
        $request->method = 'POST';
        $request->resource = static::$resource;
        $request->files = $files;
        $response = $request->send();
        check_response($response);
    }

    public function put($data = '', $email = null, $password = null) {
        $request = generate_request($data, $email, $password);
        $request->method = 'PUT';
        return $this->send_to_entity($request, $this->primary_value());
    }

    public function patch($data = '', $email = null, $password = null) {
        $request = generate_request($data, $email, $password);
        $request->method = 'PATCH';
        return $this->send_to_entity($request, $this->primary_value());
    }

    public function primary_value() {
        $key = self::$primary_key;
        return $this->$key;
    }

    public function json_property($name, $type, $default = null,
                                  $many = False, $recursive = null) {
        $this->json_properties[$name] = [$type, $many, $recursive];
        $this->$name = $default;
    }

    public function serialise($force_primary = True, $files = [],
                              $time_format = null, $consider_rights = true,
                              $for_updates = false, $html_safe= false,
                              $render_nulls = False) {
        $result = [];
        if ($force_primary) {
            $result[self::$primary_key] = $this->primary_value();
        }
        if ($this->only_for_reference and $for_updates) {
            if (!$force_primary) {
                $result[self::$primary_key] = $this->primary_value();
            }
            return [$result, $files];
        }
        if (isset($this->file_data) and isset($this->file_data[0])) {
            $index = count($files);
            array_push($files, $this->file_data);
            $result['fileDataIndex'] = $index;
        }
        if ($consider_rights) {
            $result[Rights::$json_name] = $this->rights->to_array();
        }
        foreach ($this->json_properties as $name => $info) {
            list($type, $many, $recursive) = $info;
            $value = $this->$name;
            $actual_type = gettype($value);
            if ($value === null) {
                if ($render_nulls) {
                    $result[$name] = 'None';
                }
                continue;
            }
            if (!$recursive) {
                if ($type === "DateTime") {
                    if ($value instanceof DateTime) {
                        if (!$time_format) {
                            $value = $value->getTimestamp();
                        } else {
                            $value = $value->format($time_format);
                        }
                    }
                }
                if (gettype($value) === "string" and $html_safe and !in_array($name, $this->url_fields)) {
                    $result[camelize($name)] = htmlspecialchars($value);
                } else {
                    $result[camelize($name)] = $value;
                }
            } else if ($actual_type === "array" && $many) {
                $i = 0;
                foreach ($value as $property) {
                    list($sub_data, $files) =
                        $property->serialise($force_primary, $files);
                    //$remote_name = $property::$json_name;
                    foreach ($sub_data as $subname => $subvalue) {
                        if ($subname === 'id') continue;
                        $key = $name . '-' . $i . '-' . $subname;
                        $result[$key] = $subvalue;
                    }
                    ++$i;

                    $result[$name . '-count'] = $i;
                }
            } else if ($actual_type === "object") {
                list($sub_data, $files) =
                    $value->serialise($force_primary, $files);
                foreach ($sub_data as $subname => $subvalue) {
                    $result[$name . '-' . $subname] = $subvalue;
                }
            } else if ($actual_type === "integer" && $recursive) {
                $count_key = $name . '-count';
                $count = isset($result[$count_key]) ? $result[$count_key] : 0;
                $result[$count_key] = $count + 1;
                $result[$name . '-' . $count . '-id'] = $value;
            } else if ($actual_type === $type) {
                $result[$name] = $value;
            } else {
                 $msg = "Invalid value $value with type $actual_type ";
                 $msg .= "for property $name of $this ";
                 $msg .= "that is expected to be $type ";
                 $msg .= "and recursive($recursive)";
                 throw new Exception($msg);
            }
        }
        return [$result, $files];
    }


    public function __toString()
    {
        return "<Entity " . get_class($this) . ">";
    }

    public function from_json($json) {
        $given_type = gettype($json);
        $my_class = get_class($this);
        $my_name = $my_class::$json_name;

        if ($given_type === "array" &&
            array_key_exists($my_name, $json) &&
            in_array(gettype($json[$my_name]), ["array", "integer"])) {
            $json = $json[$my_name];
        }

        if ($given_type === "array") {
            try {
                $rights_codes = $json[Rights::$json_name];
                $this->rights->from_json($rights_codes);
            } catch (Exception $e) {
                $this->rights->from_json(ALL_RIGHTS);
            }
            foreach ($this->json_properties as $name => $info) {
                if (!array_key_exists($name, $json)) {
                    $this->$name = null;
                    continue;
                }
                list($type, $many, $recursive) = $info;
                $element = $json[camelize($name)];
                $element_type = gettype($element);
                if (!$recursive) {
                    if ($type === "DateTime") {
                        $element = new DateTime(@$element);
                    }
                    $this->$name = $element;
                } else {
                    if (is_assoc($element) ||
                        $element_type === "integer") {
                        $instance = new $type();
                        $instance->from_json($element);
                        $this->$name = $instance;
                    } else if ($element_type == "array") {
                        $this->$name = [];
                        foreach ($element as $e) {
                            $instance = new $type();
                            $instance->from_json($e);
                            array_push($this->$name, $instance);
                        }

                    } else {
                        $this->$name = $element;
                    }
                }
            }
        } else if ($given_type === "integer") {
            $key = self::$primary_key;
            $this->$key = $json;
        }
    }

    public function process_for_transfer(){

    }

    public function process_before_transfer() {
        /*
           Every entity ensure that all the recursive attribute
           (entity subclass object) do its corresponding process
            before transfer
         */
        $this->process_for_transfer();
        foreach ($this->json_properties as $json_property_name) {
            $json_property = $this->$json_property_name;
            if (is_array($json_property)) {
                foreach ($json_property as $item) {
                    if ($item and !$item->is_empty()) {
                        $item->process_before_transfer();
                    }
                }
            }
            if ($json_property and ($json_property instanceof Entity) and
                !$json_property->is_empty()) {
                $json_property->process_before_transfer();
            }
        }
    }

    public function has_none_attribute() {
        $whether_has_none = false;
        foreach ($this->json_properties as $json_property_name => $info) {
            list($type, $many, $recursive) = $info;
            if (!$recursive) {
                if (is_null($this->$json_property_name) and !in_array($json_property_name, $this->escape_fields)) {
                    return false;
                }
            } else {
                if (is_null($this->$json_property_name)) {
                    return false;
                } else {
                    $entity_attribute = $this->$json_property_name;
                    $whether_has_none = $entity_attribute->has_none_attribute();
                }
            }

        }
        return $whether_has_none;
    }

    public function entity_process($attribute_group_name, $process_func) {
        $attribute_group = $this->$attribute_group_name;
        if (!isset($attribute_group)) {
            return $this;
        }

        foreach ($attribute_group as $attribute_name) {
            $attribute_value = $this->$attribute_name;
            try {
                $new_attribute_value = $process_func($attribute_value);
            } catch (Exception $e) {
                continue;
            }
            $this->$attribute_name = $new_attribute_value;
        }
        foreach ($this->json_properties as $name => $info) {
            list($type, $many, $recursive) = $info;
            if ($recursive) {
                $recursive_property = $this->$name;
                if (is_array($recursive_property) and !is_assoc($recursive_property)) {
                    foreach ($recursive_property as $item) {
                        $item->entity_process($attribute_group_name, $process_func);
                    }
                } elseif (isset($recursive_property)) {
                    $recursive_property->entity_process($attribute_group_name, $process_func);
                }
            }
        }
    }

    public function is_empty() {
        /* Return true if every attribute of that entity is None or '' */
        foreach ($this->json_properties as $name => $info) {
            if (in_array($name, $this->escape_fields)) {
                continue;
            }
            $recursive = $info[2];
            $json_property = $this->$name;
            if (!$recursive) {
                if ($json_property) {
                    return false;
                }
            } else {
                if (is_array($json_property)) {
                    foreach ($json_property as $item) {
                        if (!$item->is_empty()) {
                            return false;
                        }
                    }
                } elseif ($json_property !== null and !$json_property->is_empty()) {
                    return false;
                }
            }
        }
        return true;
    }

    public static function fetch($identifier, $embed = null, $include_archived = false, $as_domain = null,
                                 $email = null, $password = null, $api_secret = null, $query_string = null) {
        /*
         * Factory method that returns an instance of this entity named by
            the given primary key.

            Args:
              identifier: primary key of entity to fetch
              embed (dict): map of related entities to fill in
              include_archived: specified whether archived entity should
                                been taken into account
         */
        $entity = new static();
        $request = generate_request(null, null, $email, $password,$api_secret, null,$embed, $as_domain);
        if ($include_archived) {
            $request->query['include_archived'] = true;
        }
        if ($query_string) {
            $request->query = array_replace($request->query, (array)$query_string);
        }
        $response = $entity->send_to_entity($request, $identifier);
        $body = json_decode($response->body, true);
        $entity->from_json($body);
        return $entity;
    }

}

class Resource
{
    public $can_create = true;

    public function from_json($json) {
        $result = [];
        $o = $json[$this->json_name];
        foreach ($o as $item) {
            $class = $this->entity_class;
            $entity = new $class();
            $entity->from_json($item[$class::$json_name]);
            array_push($result, $entity);
        }
        return $result;
    }

    public function uri() {
        $class = $this->entity_class;
        $entity = new $class();
        return $entity::$resource;
    }

    public function get($embed = Null, $query = Null, $email = Null,$password = Null, $api_secret = Null,
                        $forbid_auto_update = false, $as_domain = Null) {
        $request = new Request();
        $request->wraps_request(null,null,$email, $password, $api_secret, $query, $embed, $as_domain);
        $request->resource = $this->uri();
        $response = $request->send();
        check_response($response);
        return $response;
    }

    public function fetch($embed = Null, $query = Null, $email = Null,$password = Null, $api_secret = Null,
                          $forbid_auto_update = false, $as_domain = Null) {
        $resp = $this->get($embed, $query, $email, $password, $api_secret, $forbid_auto_update, $as_domain);
        $body = json_decode($resp->body, true);
        return [$this->from_json($body), new PageSpecification($body['count'], $body['available'], $body['offset'],
                                                           $body['limit'], (bool)$body['cancreate'])];
    }
}

class PageSpecification
{
    public function __construct($count, $available, $offset, $limit, $can_create)
    {
        $this->count = (int)$count;
        $this->available = (int)$available;
        $this->has_create_button = $can_create;
        $this->offset = (int)$offset;
        $this->limit = (int)$limit;
    }

    public function available_pages() {
        return (int)ceil((float)$this->available / $this->limit);
    }

    public function current_page() {
        return $this->offset / $this->limit + 1;
    }

    public function page_offset($page) {
        return $this->limit * ($page - 1);
    }

    public function next_offset() {
        return $this->page_offset((int)$this->current_page()+1);
    }

    public function last_offset() {
        return $this->page_offset((int)$this->current_page()-1);
    }
}