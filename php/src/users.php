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
require_once './../php_aux/roles.php';
require_once './../php_aux/timezones.php';
require_once './../php_aux/address_util.php';

class User extends Entity
{
    public static $json_name = 'User';
    public static $resource = '/users/';


    public function __construct() {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('password', 'string');
        $this->json_property('reset_token', 'string');
        $this->json_property('created', 'DateTime');
        $this->json_property('timezone', 'integer');
        $this->json_property('email_addresses', 'EmailAddress', null, $many = True,
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

        $this->json_property('addresses', 'Address', null, $many = True,
                             $recursive = True);
        $this->json_property('phoneNumbers', 'PhoneNumber', null, $many = True,
                             $recursive = True);
        $this->json_property('categories', 'Category', null, $many = True,
                             $recursive = True);
        $this->json_property('notifications', 'Notification', null, $many = True,
                             $recursive = True);
        $this->json_property('user_companies', 'UserCompany', null, $many = True,
                             $recursive = True);
        $this->json_property('enrolled_domains', 'EnrolledDomain', null, $many = True,
                             $recursive = True);
        # Products that supplier can produce
        $this->json_property('products', 'Product', null, $many = True,
                             $recursive = True);
        $this->json_property('profile_picture', 'File', null, $many = False,
                             $recursive = True);
    }

    public function role_in_domain($domain_id){
        /*The role of this user of specific domain id*/
        if($this->enrolled_domains){
            foreach ($this->enrolled_domains as $enrolled_domain) {
                if($enrolled_domain->domain->id == $domain_id){
                    return $enrolled_domain->role;
                }
            }
        }
        return _PUBLIC;
    }

    public function all_roles(){
        /*
            Return all the roles that user have registered in super user
            have all possible roles
        */
        if($this->is_super_user){
            return ALL_ROLES;
        }
        $roles_array = [];
        foreach ($this->enrolled_domains as $ed) {
            $roles_array[] = $ed->role;
        }
        unset($ed);
        $roles_array[] = _PUBLIC;
        return $roles_array;
    }

    public function has_roles($roles){
        /*Assert whether user have roles registered*/
        $user_all_roles = $this->all_roles();
        foreach ($roles as $role) {
            if (in_array($role, $user_all_roles)) {
                return true;
            }
        }
        return false;
    }

    public function has_authority($domain_id, $roles){
        /*Check whether user is in one of the roles in certain domain*/
        return $this->is_super_user or
               in_array($this->role_in_domain($domain_id), $roles);
    }

    public function is_not_client($domain_id){
        /*Check to see if the user is part of the domain staff.*/
        return $this->has_authority($domain_id, BUSINESS_ACCOUNTS);
    }

    public function can_view_info_section($job){
        /*Return whether current user should need to view info section of a job.*/
        return $this->has_authority($job->domain->id, BUSINESS_ACCOUNTS);
    }

    public function can_view_payment_section($job){
        /*
            Return whether current user should need to view payment
          section of a job.
        */
        return $this->has_authority($job->domain->id, INVOICE_ROLES);
    }

    public function can_view_production_section($job){
        /*
          Return whether current user should need to view production
          section of a job.
        */
        return $this->has_authority($job->domain->id, PRODUCTION_SECTION);
    }

    public function can_view_drafing_section($job){
        /*
          Return whether current user should need to view drafting
          section of a job.
        */
        return $this->has_authority($job->domain->id, DESIGN_SECTION);
    }

    public function can_view_shipping_section($job){
        /*
          Return whether current user should need to view shipping
          section of a job.
        */
        return $this->has_authority($job->domain->id, SHIPPING_SECTION);
    }

    public function user_type(){
        /*Return a user friendly string indicating what type the user is*/
        if($this->is_super_user){
            return "System Admin";
        }
        return "Normal User";
    }

    public function primary_company_name(){
        /*return the user's primary company name if the user has a company*/
        if($this->user_companies and $this->user_companies[0]->company){
            return $this->user_companies[0]->company->name;
        }
        return "";
    }

    public function company_country(){
        /*Return the country which the users is located*/
        try {
            $country = $this->addresses[0]->country_name();
        } catch (Exception $e) {
            $country = "Unknown";
        }
        return $country;
    }

    public function primary_phone_number(){
        /*Return the users primary phone number including the area code*/
        try {
            $primary_phone_number =
            $this->phone_numbers[0]->international_format_number;
        } catch (Exception $e) {
            $primary_phone_number = "";
        }
        return $primary_phone_number;
    }

    public function primary_email_address(){
        /*Return the user's primary email address if they have one*/
        try {
            $primary_email_address = $this->email_addresses[0]->email_address;
          } catch (Exception $e) {
            $primary_email_address = "";
        }
        return $primary_email_address;
    }

    public function get_tzinfo(){
        /*Return the timezone of the user as a DateTimeZone object.*/
        if($this->timezone !== null){
            $timezone = $this->timezone;
        }else {
            $timezone = DEFAULT_TIMEZONE;
        }
        return new DateTimeZone($timezone);
    }

    # Factory method that create an empty instance of user
    public static function empty_user(){
        $empty_user = new static();
        $empty_user->id = -1;
        $empty_user->timezone = DEFAULT_TIMEZONE;
        return $empty_user;
    }

    public function profile_picture_url($size){
        $default_img_size = 50;
        if(is_null($size)){
            $size = $default_img_size;
        }
        if($this->profile_picture){
            return $this->profile_picture->view_url;
        }
        try {
            $primary_email = $this->email_addresses[0]->email_address;
        } catch (Exception $e) {
            $primary_email = "";
        }
        $grav_url = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($primary_email))) .
                     "?d=mm" . "&s=" . $size;
        return $grav_url;
    }

    public function dictionary_of_addresses_and_ids($address_name = null,
                                               $company_addresses = true)
    {
        /*
            Return an array of dictionaries which contain the
            name and id of address which are related to this user. If the
            company_address attribute is True it will also return the users
            related company addresses as well.
        */
        $saved_addresses = [];
        if($this->addresses){
            foreach(array_values($this->addresses) as $i => $address){
                if($address_name){
                    $name = name_primary($i, $address_name);
                }else {
                    $name = name_primary($i, $this->name);
                }
                $saved_addresses[] = ['name' => $name, 'id' => $address->id];
            }
        }

        if($company_addresses and $this->user_companies){
            foreach($this->user_companies as $user_company){
                $company = $user_company->company;
                $saved_addresses = array_merge($saved_addresses,
                   $company->dictionary_of_address_names_and_ids);
            }
        }
        return $saved_addresses;
    }

    public function public_nav_extension($url){
        /*
          Extend menu items with user info so that if
          the user is redirected to a third party site
        */
        $query = '?';
        if(strpos($url, $query) !== False){
            $query = '&';
        }
        $fmt = "%s%suser_id=%s&user_name=%s&user_email=%s";
        return sprintf($fmt, $url, $query, $this->id, rawurlencode($this->name),
                       $this->primary_email_address());
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
