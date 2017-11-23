<?php

require_once 'entity.php';
require_once 'products.php';
require_once 'companies.php';
require_once 'files.php';
require_once 'themes.php';
require_once 'menus.php';
require_once 'domain_invitations.php';
require_once 'categories.php';
require_once './../php_aux/menu_util.php';
/*
        merchi python SDK object representing Domains.

        A domain originally represented only a domain in the DNS sense, being
        an entity that is allowed to use the merchi API on a website, etc.

        In newer versions, much of the system is segregated by domain.
        Products, Jobs, Categories and Managers belong to a domain, and the
        settings of the domain will impact the behaviour and options of the
        other entities that fall under it.

        Domains defer to their Company for some of their settings.

        All user login Sessions maintain an awareness of from which domain
        the user logged in. It is illegal to create a Session except via
        a website with an attached Domain that is acting as a proxy. The domain
        will authenticate itself as well as the user when asking to create
        the session.

        Methods for making requests to get information or update the domains
        settings are inherited from sdk.python.entities.Entity.
*/
class Domain extends Entity
{
    public static $json_name = 'domain';
    public static $resource = '/domains/';


    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('domain', 'string');
        $this->json_property('sub_domain', 'string');
        $this->json_property('email_domain', 'string');
        $this->json_property('theme', 'string');
        $this->json_property('sms_name', 'string');
        $this->json_property('api_secret', 'string');
        $this->json_property('conversion_tracking_code', 'string');
        $this->json_property('show_domain_publicly', 'boolean');
        $this->json_property('enable_notifications', 'boolean');
        $this->json_property('enable_email_notifications', 'boolean');
        $this->json_property('enable_sms_notifications','boolean');
        $this->json_property('active_theme', 'Theme', '',
                             False, $recursive = True);
        $this->json_property('domain_invitations', 'DomainInvitation', [],
                             $many = True, $recursive = True);
        $this->json_property('company', 'Company', '',
                             False, $recursive = True);
        $this->json_property('logo', 'File', '',
                             False, $recursive = True);
        $this->json_property('categories', 'Category', [],
                             True, $recursive = True);
        $this->json_property('products', 'Product', null,
                             $many = True, $recursive = True);
        $this->json_property('themes', 'Theme', [],
                             $many = True, $recursive = True);
        $this->json_property('menus', 'Menu', [],
                              $many = True, $recursive = Ture);
    }

    public function public_categories() {
        $return_array = [];
        foreach ($this->categories as $category) {
            if ($category->show_public) {
                $return_array[] = $category;
            }
        }
        return $return_array;
    }

    public function email_notifications_enabled() {
        return $this->enable_notifications and
            $this->enable_email_notifications;
    }

    public function sms_notifications_enabled() {
        return $this->enable_notifications and
            $this->enable_sms_notifications;
    }

    public function main_menu() {
        if($this->menus) {
            foreach($this->menus as $menu) {
                if ($menu->menu_type == MAIN) {
                    return $menu;
                }
            }
        }
        return null;
    }

    public function safe_conversion_tracking_code($invoice = null) {
        $code = $this->conversion_tracking_code;
        if (!isset($code)) {
            return '';
        }
    }
}

class EnrolledDomain extends Entity
{
    public static $resource = '/enrolled_domains/';
    public static $json_name = 'enrolled_domain';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('role', 'string');
        $this->json_property('domain', 'Domain', null,
                             $many = False, $recursive = True);
        $this->json_property('user', 'User', null,
                              $many = False, $recursive = True);
    }
}


class Domains_ extends Resource
{
    public function __construct() {
        $this->entity_class = 'Domain';
        $this->json_name = 'domains';
    }
}

class EnrolledDomains_ extends Resource
{
    public function __construct() {
        $this->entity_class = 'EnrolledDomain';
        $this->json_name = 'enrolled_domains';
    }
}

$domains = new Domains_();
$enrolled_domains = new EnrolledDomains_();
