<?php
declare(strict_types=1);

require_once 'entity.php';

class Company extends Entity
{
    public static $json_name = 'company';
    public static $resource = '/companies/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('archived', 'integer');
        $this->json_property('name', 'string');
        $this->json_property('call_to_actions', 'string');
        $this->json_property('call_to_action_details', 'string');
        $this->json_property('website', 'string');
        $this->json_property('ownership_unconfirmed', 'boolean');
        $this->json_property('tax_number', 'string');
        $this->json_property('tax_number_type', 'string');
        $this->json_property('is_paypal_valid', 'boolean');
        $this->json_property('is_stripe_account_enabled', 'boolean');
        $this->json_property('is_stripe_account_enabled', 'boolean');
        $this->json_property('stripe_account_id', 'string');
        $this->json_property('stripe_customer_id', 'string');
        $this->json_property('sendle_active', 'boolean');
        $this->json_property('sendle_api_key', 'string');
        $this->json_property('sendle_id', 'string');
        $this->json_property('is_new', 'boolean');
        $this->json_property('subscription_outstanding', 'boolean');
        $this->json_property('trial_end_date', 'integer');
        $this->json_property('trial_end_date_updated', 'integer');
        $this->json_property('is_blocked', 'boolean');
        $this->json_property('is_testing', 'boolean');
        $this->json_property('square_access_token', 'string');
        $this->json_property('square_refresh_token', 'string');
        $this->json_property('square_expires_at', 'integer');
        $this->json_property('square_is_valid', 'boolean');
        $this->json_property('square_merchant_id', 'string');
        $this->json_property('square_web_location_id', 'string');
        $this->json_property('stripe_publishable_test_key', 'string');
        $this->json_property('stripe_api_test_key', 'string');
        $this->json_property('stripe_publishable_key', 'string');
        $this->json_property('stripe_api_key', 'string');
        $this->json_property('stripe_connect_disabled', 'boolean');
        $this->json_property('is_paying_company', 'boolean');
        $this->json_property('is_stripe_valid', 'boolean');
        $this->json_property('accept_square', 'boolean');
        $this->json_property('accept_stripe', 'boolean');
        $this->json_property('accept_paypal', 'boolean');
        $this->json_property('accept_utrust', 'boolean');
        $this->json_property('is_utrust_valid', 'boolean');
        $this->json_property('accept_bank_transfer', 'boolean');
        $this->json_property('accept_phone_payment', 'boolean');

        $this->json_property('country', 'string');
        $this->json_property('default_currency', 'string');
        $this->json_property('paypal_account', 'string');
        $this->json_property('paypal_password', 'string');
        $this->json_property('paypal_signature', 'string');
        $this->json_property('utrust_api_key', 'string');
        $this->json_property('utrust_webhook_key', 'string');

        $this->json_property('trial_end_date_set_by', 'User', $many = true, $recursive = true);
        $this->json_property('logo', 'MerchiFile', $many = false, $recursive = true);
        $this->json_property('default_tax_type', 'CountryTax', $many = false, $recursive = true);
        $this->json_property('automatic_payment_relationships', 'AutomaticPaymentRelationship', $many = true, $recursive = true);
        $this->json_property('tax_types', 'CountryTax', $many = true, $recursive = true);
        $this->json_property('payment_devices', 'PaymentDevice', $many = true, $recursive = true);
        $this->json_property('subscription_plan', 'SubscriptionPlan', $many = false, $recursive = true);
        $this->json_property('_email_addresses', 'EmailAddress', $many = true, $recursive = true);
        $this->json_property('_payment_phone_numbers', 'PhoneNumber', $many = true, $recursive = true);
        $this->json_property('_phone_numbers', 'PhoneNumber', $many = true, $recursive = true);
        $this->json_property('_addresses', 'Address', $many = true, $recursive = true);
        $this->json_property('_users', 'UserCompany', $many = true, $recursive = true);
        $this->json_property('shipments_as_sender', 'Shipment', $many = true, $recursive = true);
        $this->json_property('saved_products', 'Product', $many = true, $recursive = true);
        $this->json_property('user_companies', 'UserCompany', $many = true, $recursive = true);
        $this->json_property('company_invitations', 'CompanyInvitation', $many = true, $recursive = true);
        $this->json_property('applied_jobs', 'Job', $many = true, $recursive = true);
        $this->json_property('carts', 'Cart', $many = true, $recursive = true);
        $this->json_property('domains', 'Domain', $many = true, $recursive = true);
        $this->json_property('accessible_domains_as_client_company', 'Domain', $many = true, $recursive = true);
        $this->json_property('email_addresses', 'EmailAddress', $many = true, $recursive = true);
        $this->json_property('payment_phone_numbers', 'PhoneNumber', $many = true, $recursive = true);
        $this->json_property('phone_numbers', 'PhoneNumber', $many = true, $recursive = true);
        $this->json_property('invoices_has', 'Invoice', $many = true, $recursive = true);
        $this->json_property('addresses', 'Address', $many = true, $recursive = true);

        $this->json_property('banks', 'Bank', $many = true, $recursive = true);

    }
}
