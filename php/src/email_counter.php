<?php
declare(strict_types=1);

require_once 'entity.php';

class EmailCounter extends Entity
{
    public static $json_name = 'email_counter';
    public static $resource = '/email_counters/';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('unsubscribed', 'boolean');
        $this->json_property('emailAddress', 'string');
        $this->json_property('silenced', 'boolean');
        $this->json_property('tokens', 'integer');
    }
}
