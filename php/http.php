<?php

require_once 'config.php';
require_once './../php_aux/name_protocol.php';

const CURRENT_VERSION = 6;

function process_dict_param($embed) {
    if (isset($embed)) {
        if (is_array($embed)) {
            $embed = json_encode($embed);
        } elseif (gettype($embed) === "string") {

        } else {
            $embed = null;
        }
    }
    return $embed;
}

class Response
{
    public $status_code = null;
    public $body = null;
}

class Request
{
    public $server = 'http://backend:5000/';
    public $version = 'v'. (string)CURRENT_VERSION;
    public $method = 'GET';
    public $resource = '/';
    public $query = [];
    public $headers = [];
    public $username = null;
    public $embed = null;
    public $password = null;
    public $api_secret = null;
    public $as_domain = null;
    public $data = [];
    public $files = [];
    public $cookies = [];

    public function path() {
        return $this->version . $this->resource;
    }

    public function url() {
        $query_string = '?' . http_build_query($this->query);
        $result = $this->server . $this->path();
        if ($query_string !== '') {
            $result = $result . $query_string;
        }
        return $result;
    }

    public function auth(){
        if(!is_null($this->username))
        {
            return $this->username . $this->password;
        }
        return null;
    }

    public function version_number(){
        return (integer)substr($this->version,1);
    }

    public function wraps_request($data = null, $files = null, $email = null, $password = null,
                                  $api_secret = null, $query = null, $embed = null, $as_domain = null) {
        /* Wrap user customized information to request*/
        $this->files = $files;
        $this->data = $data;
        $this->username = $email;
        $this->password = $password;
        $this->api_secret = $api_secret;
        $this->embed = $embed;
        $this->as_domain = $as_domain;
        if ($query) {
            $this->query = array_replace($this->query, $query);
        } else {
            $this->query = [];
        }
    }

    public function send() {
        $handle = curl_init();
        $data = $this->data;
        $file_count = count($this->files);
        for ($i = 0; $i < $file_count; ++$i) {
            $file = $this->files[$i];
            $data[strval($i)] =  new CurlFile(realpath($file->file_data),
                                              $file->mimetype, strval($i));
        }
        if ($data) {
            $data_json = parse_json_key_camel($data);
            $data = unpack_recursive_json($data_json);
        }
        if (isset($this->api_secret)) {
            $this->query['api_secret'] = $this->api_secret;
        }
        if (isset($this->embed)) {
            $this->query['embed'] = process_dict_param($this->embed);
        }
        if (isset($this->as_domain)) {
            $this->query['as_domain'] = $this->as_domain;
        }
        curl_setopt_array($handle,
                          [CURLOPT_RETURNTRANSFER => 1,
                           CURLOPT_URL => $this->url(),
                           CURLOPT_USERAGENT => 'merchi PHP SDK',
                           CURLOPT_CUSTOMREQUEST => $this->method,
                           CURLOPT_SAFE_UPLOAD => True,
                           CURLOPT_POST => 1,
                           CURLOPT_USERPWD => $this->auth(),
                           CURLOPT_HTTPHEADER => $this->headers,
                           CURLOPT_COOKIE => http_build_query($this->cookies, null, ";"),
                           CURLOPT_POSTFIELDS => $data]);
        $result = curl_exec($handle);

        if (curl_errno($handle))
        {
            $msg = 'Curl error: ' . curl_error($handle);
            curl_close($handle);
            throw new Exception($msg);
        }
        $response = new Response();
        $response->status_code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        $response->body = $result;
        curl_close($handle);
        return $response;
    }

    function __construct() {
        $this->server = BACKEND_PROTO . BACKEND_URI;
    }

}
