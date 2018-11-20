<?php
declare(strict_types=1);

require_once 'entity.php';

class File_ extends Entity
{
    public static $json_name = 'file';
    public static $resource = '/files/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('size', 'integer');
        $this->json_property('mimetype', 'integer');
    }

    public function from_php_info($info)
    {
        $this->name = $info['name'];
        $this->type = $info['type'];
        $this->size = $info['size'];
        $this->file_data = $info['tmp_name'];
    }
}

class Files_ extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'File_';
        $this->json_name = 'files';
    }
}

$files = new Files_();
