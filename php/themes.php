<?php

require_once 'entity.php';
require_once 'files.php';
require_once 'users.php';
require_once 'domains.php';
require_once './../php_aux/theme_status.php';

class Theme extends Entity
{
    public static $resource = '/themes/';
    public static $json_name = 'theme';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id','integer');
        $this->json_property('name','string');
        $this->json_property('description','string');
        $this->json_property('public','boolean');
        $this->json_property('main_css_status','integer');
        $this->json_property('main_css_error_message','string');
        $this->json_property('email_css_status','integer');
        $this->json_property('email_css_error_message','string');

        # not serialised by default, must be asked for via `embed` parameter
        $this->json_property('index_page_template','string');
        $this->json_property('index_page_compiled','string');
        $this->json_property('invoices_page_template','string');
        $this->json_property('invoices_page_compiled','string');
        $this->json_property('products_page_template','string');
        $this->json_property('products_page_compiled','string');
        $this->json_property('header_template','string');
        $this->json_property('header_compiled','string');
        $this->json_property('footer_template','string');
        $this->json_property('footer_compiled','string');

        $this->json_property('index_page_error','string');
        $this->json_property('invoices_page_error','string');
        $this->json_property('products_page_error','string');
        $this->json_property('header_error','string');
        $this->json_property('footer_error','string');
        $this->json_property('last_updated','DateTime');

        $this->json_property('main_css_file', 'File', null,$many = False,
                              $recursive = True);
        $this->json_property('main_css_template_editing', 'File', null,$many = False,
                              $recursive = True);
        $this->json_property('main_css_template_using', 'File', null, $many = False,
                              $recursive = True);
        $this->json_property('email_css_file', 'File', null,$many = False,
                              $recursive = True);
        $this->json_property('email_css_template_editing', 'File', null, $many = False,
                              $recursive = True);
        $this->json_property('email_css_template_using', 'File', null, $many = False,
                              $recursive = True);
        $this->json_property('feature_image', 'File', null,$many = False,
                              $recursive = True);
        $this->json_property('css_image_files', 'File', null, $many = True,
                              $recursive = True);
        $this->json_property('author', 'User', null, $many = False,
                              $recursive = True);
        $this->json_property('domain', 'Domain', null, $many = False,
                              $recursive = True);
    }

    public function is_valid_and_updated(){
        /*Check both main css template and email css template
            are valid and up to date
        */
        return $this->main_css_status == VALID_AND_UPDATED and
               $this->email_css_status == VALID_AND_UPDATED and
               $this->index_page_error === null and
               $this->products_page_error === null;
    }

    public function can_be_activated(){
        /*Check whether this theme can be a valid activated theme*/
        return $this->main_css_status >= VALID_BUT_NOT_UPDATED and
               $this->email_css_status >= VALID_BUT_NOT_UPDATED;
    }
}

class Themes extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Theme';
        $this->json_name = 'themes';
    }
}

class DefaultTheme extends Entity
{
    public static $resource = '/default_themes/';
    public static $json_name = 'defaultTheme';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('name','string');
    }
}

class DefaultThemes extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'DefaultTheme';
        $this->json_name = 'defaultThemes';
    }
}

$default_themes = new DefaultThemes();
$themes = new Themes();
