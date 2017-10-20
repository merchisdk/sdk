<?php

class ItemTypes
{
    const PROCESS = 0;
    const SHIPPING = 1;
    const TAX = 2;
    const MATERIAL = 3;
    const OTHER = 4;
    const PRODUCT = 5;

    const item_type = array(
        PROCESS => "Processing",
        SHIPPING => "Shipping",
        TAX => "Tax",
        MATERIAL => "Material",
        OTHER => "Other",
        PRODUCT => "Product");
}
$item_types = new ItemTypes();
