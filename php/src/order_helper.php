<?php
    declare(strict_types=1);

    require_once 'users.php';
    require_once 'addresses.php';
    require_once 'email_addresses.php';
    require_once 'phone_numbers.php';
    require_once 'stores.php';
    require_once 'roles.php';
    require_once 'jobs.php';
    require_once 'files.php';
    require_once 'companies.php';
    require_once 'entity.php';

    function send_order_request($user, $job)
    {
        list($user_data, $_) = $user->serialise();
        $temp_array = [];
        foreach ($user_data as $key => $value) {
           $temp_array['user-' . $key] = $value;
        }
        $user_data = $temp_array;
        list($job_data, $files) = $job->serialise();
        $temp_array = [];
        foreach ($job_data as $key => $value) {
           $temp_array['job-' . $key] = $value;
        }
        $job_data = $temp_array;
        $combined_data = array_merge($user_data, $job_data);
        $request = generate_request($combined_data);
        $request->method = 'POST';
        $request->resource = '/order/';
        $request->files = $files;
        $response = $request->send();
        check_response($response);
    }

    function place_order($lineOne, $lineTwo, $city, $state, $country, $postcode,
                         $emailAddress, $phoneCode, $phoneNumber, $name,
                         $company_name, $product, $quantity, $store, $notes,
                         $files)
    {
        $a = new Address();
        $a->line_one = $lineOne;
        $a->line_two = $lineTwo;
        $a->city = $city;
        $a->state = $state;
        $a->country = $country;
        $a->postcode = $postcode;

        $e = new EmailAddress();
        $e->emailAddress = $emailAddress;

        $p = new PhoneNumber();
        $p->number = $phoneNumber;
        $p->code = $phoneCode;

        $u = new User();
        $u->name = $name;
        $u->emailAddresses = [$e];
        $u->address = [$a];
        $u->phoneNumbers = [$p];
        $u->store = intval($store);

        if ($company_name) {
            $c = new Company();
            $c->name = $company_name;
            $c->emailAddresses = [$e];
            $c->phoneNumbers = [$p];
            $c->banks = [];
            $c->addresses = [$a];
            $u->companies = [$c];
        } else {
            $u->companies = [];
        }

        $j = new Job();
        $j->product = intval($product);
        $j->quantity = intval($quantity);
        $j->store = intval($store);
        $j->notes = $notes;
        $j->deadline = null;

        $j->clientFiles = [];

        foreach ($files as $info) {
            if ($info['size'] > 0) {
                $f = new File_();
                $f->from_php_info($info);
                array_push($j->clientFiles, $f);
            }
        }

        send_order_request($u, $j);
    }

    function get_products_for_store($store_id)
    {
        $store_object = new Store();
        $store_object->id = $store_id;
        $store_object->get($store_id, $embed = '{"products": {}}');
        return $store_object->products;
    }
