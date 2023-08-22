<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'products.php';

class Domain extends Entity
{
    public static $json_name = 'domain';
    public static $resource = '/domains/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('domain', 'string');
        $this->json_property('country', 'string');
        $this->json_property('currency', 'string');
        $this->json_property('callToActions', 'string');
        $this->json_property('callToActionDetails', 'string');
        $this->json_property('isMaster', 'boolean');
        $this->json_property('subdomain', 'string');
        $this->json_property('email_domain', 'string');
        $this->json_property('sms_name', 'string');
        $this->json_property('showDomainPublicly', 'boolean');
        $this->json_property('publicAccessRestricted', 'boolean');
        $this->json_property('enableEmailNotifications', 'boolean');
        $this->json_property('enableSmsNotifications', 'boolean');
        $this->json_property('mailgunRecords', 'TODO');
        $this->json_property('enableNotifications', 'boolean');
        $this->json_property('trackingCodeGoogleConversion', 'string');
        $this->json_property('trackingCodeGoogleGlobal', 'string');
        $this->json_property('apiSecret', 'string');
        $this->json_property('webflowApiKey', 'string');
        $this->json_property('shopifyShopUrl', 'string');
        $this->json_property('shopifyIsActive', 'boolean');
        $this->json_property('qrShopQrCode', 'string');

        $this->json_property('domain_type', 'integer');
        $this->json_property('email_domain', 'string');
        $this->json_property('theme', 'string');

        $this->json_property('domainType', 'DomainType', null, $many = False,
            $recursive = True);
        $this->json_property('ownedBy', 'Company', null, $many = False,
            $recursive = True);
        $this->json_property('company', 'Company', null, $many = False,
            $recursive = True);
        $this->json_property('logo', 'MerchiFile', null, $many = False,
            $recursive = True);
        $this->json_property('favicon', 'MerchiFile', null, $many = False,
            $recursive = True);
        $this->json_property('activeTheme', 'Theme', null, $many = False,
            $recursive = True);
        $this->json_property('tags', 'DomainTag', null, $many = True,
            $recursive = True);
        $this->json_property('canSupply', 'Domain', null, $many = True,
            $recursive = True);
        $this->json_property('suppliedBy', 'Domain', null, $many = True,
            $recursive = True);
        $this->json_property('accessibleClients', 'User', null, $many = True,
            $recursive = True);
        $this->json_property('accessibleClientCompanies', 'Company', null, $many = True,
            $recursive = True);
        $this->json_property('menus', 'Menu', null, $many = True,
            $recursive = True);
        $this->json_property('sessions', 'Session', null, $many = True,
            $recursive = True);
        $this->json_property('categories', 'Category', null, $many = True,
            $recursive = True);
        $this->json_property('notifications', 'Notification', null, $many = True,
            $recursive = True);
        $this->json_property('products', 'Product', null, $many = True,
            $recursive = True);
        $this->json_property('supplyProducts', 'SupplyDomain', null, $many = True,
            $recursive = True);
        $this->json_property('jobs', 'Job', null, $many = True,
            $recursive = True);
        $this->json_property('jobsAssignees', 'User', null, $many = True,
            $recursive = True);
        $this->json_property('carts', 'Cart', null, $many = True,
            $recursive = True);
        $this->json_property('enrollments', 'EnrolledDomain', null, $many = True,
            $recursive = True);
        $this->json_property('invoices', 'Invoice', null, $many = True,
            $recursive = True);
        $this->json_property('domainInvitations', 'DomainInvitation', null, $many = True,
            $recursive = True);
        $this->json_property('seoDomainPages', 'SeoDomainPage', null, $many = True,
            $recursive = True);
        $this->json_property('themes', 'Theme', null, $many = True,
            $recursive = True);
    }

    public function default_tax_type()
    {
        if (!$this->company) {
            throw new Exception('company is undefined, did you forget to embed it?');
        }
        if (!$this->company->default_tax_type) {
            throw new Exception('company.defaultTaxType is undefined, did you forget to  embed it?');
        }
        return $this->company->default_tax_type;
    }

    public function get_active_theme()
    {
        if (!$this->active_theme) {
            throw new Exception('company is undefined, did you forget to embed it?');
        }
        return $this->active_theme;
    }
}

class Domains_ extends Resource
{
    public function __construct()
    {
        $this->entity_class = 'Domain';
        $this->json_name = 'domainss';
    }
}

$domains = new Domains_();
