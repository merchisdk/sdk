<?php
declare(strict_types=1);

require_once 'entity.php';

class Component extends Entity
{
    public static $json_name = 'component';
    public static $resource = '/components/';


    public function __construct()
    {
        $this->json_property('archived', 'integer');
        $this->json_property('created', 'integer');
        $this->json_property('updated', 'integer');
        $this->json_property('id', 'integer');
        $this->json_property('is_class_based', 'boolean');
        $this->json_property('out_of_sync_with_original', 'boolean');
        $this->json_property('needs_update', 'boolean');
        $this->json_property('has_imports', 'integer');
        $this->json_property('is_clone', 'boolean');
        $this->json_property('warnings', 'boolean');
        $this->json_property('name', 'string');
        $this->json_property('body', 'string');
        $this->json_property('description', 'string');
        $this->json_property('compiled', 'string');

        $this->json_property('component_export', 'Component', $many = False, $recursive = True);
        $this->json_property('component_exports', 'Component', $many = True, $recursive = True);
        $this->json_property('component_imports', 'Component', $many = True, $recursive = True);
        $this->json_property('original_component', 'Component', $many = False, $recursive = True);
        $this->json_property('images', 'MerchiFile', $many = True, $recursive = True);
        $this->json_property('feature_image', 'MerchiFile', $many = False, $recursive = True);
        $this->json_property('tags', 'ComponentTag', $many = True, $recursive = True);
        $this->json_property('created_by', 'User', $many = False, $recursive = True);
        $this->json_property('updated_by', 'User', $many = False, $recursive = True);

    }
}
