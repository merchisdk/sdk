<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'quote_items.php';

function addup_subtotal($prev_total, $b)
{
    // Return the value of object.quantity * object.unit_price
    return $prev_total + ($b->quantity * $b->unit_price);
}

class Quote extends Entity
{
    public static $resource = '/quotes/';
    public static $json_name = 'quote';

    public function __construct()
    {
        parent::__construct();
        $this->json_property('id', 'integer');
        $this->json_property('agreed_deadline', 'DateTime');
        $this->json_property('assignments', 'Assignment', $default = [],
                             True, $recursive = True);
        $this->json_property('quote_items', 'QuoteItem', $default = [],
                             True, $recursive = True);
    }

    public function quote_total()
    {
        /*
            Calculate the quote sub total by adding
            all the quote_item totals together.
        */

        return round(array_reduce($this->quote_items, "addup_subtotal"), 2);
    }
}

class Quotes extends Resource
{
    public function __construct()
    {
        $this->json_name = 'quotes';
        $this->entity_class = 'Quote';
    }
}

$quotes = new Quotes();
