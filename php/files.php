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
        $this->type = $info['type'];
        #TODO?
        $this->size = $info['size'];
        #Not sure if this property can still be retrived in this way
        $this->file_data = $info['tmp_name'];
    }

    public function is_image(){
      try{
        var type = explode('/',$this->type);
        return type[0] == 'image';
      }
      catch(){
        return True;
      }
    }

    public function is_pdf(){
      return in_array($this->type,['application/pdf', 'application/x-pdf']);
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
