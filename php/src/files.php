<?php

require_once 'entity.php';

class File_ extends Entity
{
    public static $json_name = 'file';
    public static $resource = '/files/';

    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('size', 'integer');
        $this->json_property('mimetype', 'integer');
        $this->json_property('view_url', 'string');
        $this->json_property('download_url', 'string');
        $this->json_property('creation_date', 'DateTime');
        $this->json_property('uploader', 'User', null,
                             False, $recursive = True);
        $this->file_data = [];
        $this->url_fields = ['view_url', 'download_url'];

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
