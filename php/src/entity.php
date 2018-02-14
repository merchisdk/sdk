<?php

require_once 'http.php';
require_once 'utility.php';

function generate_request($data, $email = null, $password = null)
{
    $request = new Request();
    $request->data = $data;
    $request->username = $email;
    $request->password = $password;
    return $request;
}

function check_response($response)
{
    if ($response->status_code < 199 || $response->status_code > 299)
    {
        $body = json_decode($response->body, true);
        $message = $body['message']['message'];
        throw new Exception($message);
    }
    return True;
}

class Entity
{
    public static $primary_key = 'id';
    public $json_properties = [];

    public $escape_fields = [];
    public $recursive_properties = [];

    public function send_to_entity($request, $identifier)
    {
        $request->resource = $this::$resource . $identifier . '/';
        return $request->send();
    }

    public function get($identifier, $embed = null)
    {
        $request = new Request();
        $request->query['embed'] = $embed;
        $response = $this->send_to_entity($request, $identifier);
        check_response($response);
        $body = json_decode($response->body, true);
        return $this->from_json($body);
    }

    public function delete($identifier)
    {
        $request = new Request();
        $request->method = 'DELETE';
        return $this->send_to_entity($request, $identifier);
    }

    public function destroy()
    {
        list($_, $status) = $this->delete($this->primary_value());
        if ($status != 204) {
            throw new Exception('could not destroy object.');
        }
    }

    public function create($email = null, $password = null)
    {
        list($data, $files) = $this->serialise();
        $request = generate_request($data, $email, $password);
        $request->method = 'POST';
        $request->resource = static::$resource;
        $request->files = $files;
        $response = $request->send();
        check_response($response);
    }

    public function put($data = '', $email = null, $password = null)
    {
        $request = generate_request($data, $email, $password);
        $request->method = 'PUT';
        return $this->sent_to_entity($request, $this->primary_value());
    }

    public function patch($data = '', $email = null, $password = null)
    {
        $request = generate_request($data, $email, $password);
        $request->method = 'PATCH';
        return $this->send_to_entity($request, $this->primary_value());
    }

    public function primary_value()
    {
        $key = self::$primary_key;
        return $this->$key;
    }

    public function json_property($name, $type, $default = null,
                                  $many = False, $recursive = null)
    {
        $this->json_properties[$name] = [$type, $many, $recursive];
        $this->$name = $default;
    }

    public function serialise($force_primary = True, $files = [],
                              $render_nulls = False)
    {
        $result = [];
        if ($force_primary) {
            $result[self::$primary_key] = $this->primary_value();
        }
        if (isset($this->file_data)) {
            $index = count($files);
            array_push($files, $this);
            $result['fileDataIndex'] = $index;
        }
        foreach ($this->json_properties as $name => $info) {
            list($type, $many, $recursive) = $info;
            $value = $this->$name;
            $actual_type = gettype($value);
            if ($value === null) {
                if ($render_nulls) {
                    $result[$name] = 'None';
                }
            } else if ($actual_type === "array" && $many) {
                $i = 0;
                foreach ($value as $property) {
                    list($sub_data, $files) =
                        $property->serialise($force_primary, $files);
                    // $remote_name = $property::$json_name;
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

    public function from_json($json)
    {
        $given_type = gettype($json);
        $my_class = get_class($this);
        $my_name = $my_class::$json_name;

        if ($given_type === "array" &&
            array_key_exists($my_name, $json) &&
            in_array(gettype($json[$my_name]), ["array", "integer"])) {
            $json = $json[$my_name];
        }

        if ($given_type === "array") {
            foreach ($this->json_properties as $name => $info) {
                if (!array_key_exists($name, $json)) {
                    $this->$name = null;
                    continue;
                }
                list($type, $many, $recursive) = $info;
                $element = $json[$name];
                $element_type = gettype($element);
                if (!$recursive) {
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
            $key = $this->primary_key;
            $this->$key = $json;
        }
    }

}

class Resource
{
    public function from_json($json)
    {
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

    public function uri()
    {
        $class = $this->entity_class;
        $entity = new $class();
        return $entity::$resource;
    }

    public function get($embed = Null)
    {
        $request = new Request();
        $request->query['embed'] = $embed;
        $request->resource = $this->uri();
        $response = $request->send();
        check_response($response);
        $body = json_decode($response->body, true);
        return $this->from_json($body);
    }
}
