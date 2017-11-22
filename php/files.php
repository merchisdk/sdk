<?php

require_once 'entity.php';

class File_ extends Entity
{
    public static $json_name = 'file';
    public static $resource = '/files/';
    public static $url_fields = ['view_url', 'download_url'];


    public function __construct() {
        $this->url_fields = ['view_url', 'download_url'];
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('size', 'integer');
        $this->json_property('mimetype', 'integer');
        $this->json_property('view_url', 'string');
        $this->json_property('download_url', 'string');
        $this->json_property('creation_date', 'datetime');
        $this->json_property('uploader', 'User', $many = False,
                             $default = '1', $recursive = True);
        $this->file_data = [];

    }

    public function from_php_info($info) {
        $this->name = $info['name'];
        $this->mimetype = $info['mimetype'];
        $this->file_data = [$this->name, $info, $info['mimetype']];
    }

    public function is_image(){
        try{
          $type = explode('/',$this->mimetype);
          return $type[0] == 'image';
        }
        catch(Exception $e){
          return True;
        }
    }

    public function is_pdf(){
        return in_array($this->mimetype,['application/pdf', 'application/x-pdf']);
    }
}


class Files_ extends Resource
{
    public function __construct() {
        $this->entity_class = 'File_';
        $this->json_name = 'files';
    }
}

$files = new Files_();
