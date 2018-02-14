<?php

require_once 'config.php';

class Response
{
    public $status_code = null;
    public $body = null;
}

class Request
{
    public $server = '';
    public $version = 'v6';
    public $method = 'GET';
    public $resource = '/';
    public $query = [];
    public $headers = [];
    public $username = null;
    public $password = null;
    public $data = [];
    public $files = [];

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

    public function send() {
        $handle = curl_init();
        $data = $this->data;
        $file_count = count($this->files);
        for ($i = 0; $i < $file_count; ++$i) {
            $file = $this->files[$i];
            $data[strval($i)] = new CurlFile(realpath($file->file_data),
                                              $file->mimetype, strval($i));
        }
        curl_setopt_array($handle,
                          [CURLOPT_RETURNTRANSFER => 1,
                           CURLOPT_URL => $this->url(),
                           CURLOPT_USERAGENT => 'merchi PHP SDK',
                           CURLOPT_CUSTOMREQUEST => $this->method,
                           CURLOPT_SAFE_UPLOAD => True,
                           CURLOPT_POST => 1,
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
