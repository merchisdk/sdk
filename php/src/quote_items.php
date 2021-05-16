<?php
declare(strict_types=1);

require_once 'entity.php';
require_once 'util/item_types.php';

class QuoteItem extends Entity
{
    public static $resource = '/quote_items/';
    public static $json_name = 'quote_item';


    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('type', 'integer');
        $this->json_property('quantity', 'integer');
        $this->json_property('description', 'string');
        $this->json_property('unit_price', 'float');
    }

    public function item_total()
    {
        /*
            Calculate the total of the item by
            multiplying the unit_price and quantity. It then
            returns the total
        */

        $total = $this->quantity * $this->unit_price;
        return $total;
    }

    public function item_type_name()
    {
        // return name of the quote item type instead of type id
        return ITEM_TYPE[$this->type];
    }
}

class QuoteItems extends resource
{
    public function __construct()
    {
        $this->entity_class = 'QuoteItem';
        $this->json_name = 'quoteItem';
    }
}

$quote_items = new QuoteItems();
