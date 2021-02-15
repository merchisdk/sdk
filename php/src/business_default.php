<?php
declare(strict_types=1);

const DEFAULT_INVOICE_DUE_TIME = 24;  // default 1 day count by hours

const URGENT_JOB_PRIORITY = 1;
const HIGH_JOB_PRIORITY = 2;
const MEDIUM_JOB_PRIORITY = 3;
const LOW_JOB_PRIORITY = 4;

const URGENT_STRING = "urgent";
const HIGH_STRING = "high";
const MEDIUM_STRING = "medium";
const LOW_STRING = "low";

// map strings to integers
const PRIORITY_OPTIONS = [
    URGENT_STRING => URGENT_JOB_PRIORITY,
    HIGH_STRING => HIGH_JOB_PRIORITY,
    MEDIUM_STRING => MEDIUM_JOB_PRIORITY,
    LOW_STRING => LOW_JOB_PRIORITY];

// map integers to strings
$PRIORITY_OPTIONS_REVERSE_MAP = [];
foreach (PRIORITY_OPTIONS as $key => $value) {
    $PRIORITY_OPTIONS_REVERSE_MAP[$value] = $key;
}
unset($key, $value);

const ONLINE_PAYMENT = 1;
const PAYPAL_PAYMENT = 2;
const BANK_TRANSFER = 3;
const CASH = 4;
const CHEQUE = 5;
const PHONE_PAYMENT = 6;
const CREDIT_CARD = 7;
const UTRUST_PAYMENT = 8;

const PAYMENT_TYPES = [
    ONLINE_PAYMENT => "Online Payment",
    PAYPAL_PAYMENT => "PayPal Payment",
    BANK_TRANSFER => "Bank Transfer",
    CASH => "Cash",
    CHEQUE => "Cheque",
    PHONE_PAYMENT => "Phone Payment",
    CREDIT_CARD => "Credit Card",
    UTRUST_PAYMENT => "Utrust Payment"];

$PAYMENT_TYPES_OPTIONS = [];
foreach (PAYMENT_TYPES as $key => $value){
    $PAYMENT_TYPES_OPTIONS[$value] = $key;
}
unset($key, $value);
