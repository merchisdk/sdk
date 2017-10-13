<?php

require_once 'entity.php';
require_once 'user_companies.php';
require_once 'email_addresses.php';
require_once 'addresses.php';
require_once 'phone_numbers.php';
require_once 'categories.php';
require_once 'notifications.php';
require_once 'files.php';
require_once 'products.php';
require_once 'domains.php';

class User extends Entity
{
    public static $json_name = 'User';
    public static $resource = '/users/';


    public function __construct() {
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('password', 'string');
        $this->json_property('reset_token', 'string');
        $this->json_property('created', 'DateTime');
        $this->json_property('timezone', 'integer');
        $this->json_property('emailAddresses', 'EmailAddress', $many = True,
                             $recursive = True);

        $this->json_property('incomplete_jobs_count', 'integer');
        $this->json_property('unpaid_jobs_count', 'integer');
        $this->json_property('ready_for_shipping_count', 'integer');
        $this->json_property('production_quoting_count', 'integer');
        $this->json_property('comments', 'string');
        $this->json_property('preferred_language', 'string');
        $this->json_property('enable_crash_reports', 'boolean');
        $this->json_property('enable_client_emails', 'boolean');
        $this->json_property('enable_invoice_reminders', 'boolean');
        $this->json_property('is_super_user', 'boolean');

        $this->json_property('address', 'Address', $many = True,
                             $recursive = True);
        $this->json_property('phoneNumbers', 'PhoneNumber', $many = True,
                             $recursive = True);
        $this->json_property('categories', 'Category', $many = True,
                             $recursive = True);
        $this->json_property('notifications', 'Notification', $many = True,
                             $recursive = True);
        $this->json_property('user_companies', 'UserCompany', $many = True,
                             $recursive = True);
        $this->json_property('enrolled_domains', 'EnrolledDomain', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('products', 'Product', $many = True,
                             $recursive = True);
        $this->json_property('profile_picture', 'File', $many = False,
                             $recursive = True);
    }
}

class Users extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'User';
        $this->json_name = 'users';
    }
}

$users = new Users();
