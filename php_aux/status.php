<?php
/*
    Define names for various stages in the "production" part of
    the job state which are used by the homepage and production job tab page to
    display progress information.

    N.B. MAGIC NUMBER exists in production status template, so be careful about
    changing these values
*/

const DB_VALUE = "dbValue";
const STATUS_DESCRIPTION = "text";
const PROGRESS_INDICATOR = "percentage";
const PROGRESS_CSS_CLASS = "cssClass";

const PRODUCTION_STATUS = [
    "INIT" =>  ["dbValue" =>  0, "text" =>  "Start Production", "percentage" =>  0,
             "cssClass" =>  "progress-bar-inverse"],
    "REJECTED" =>  ["dbValue" =>  1, "text" =>  "Suppliers Rejected",
                 "percentage" =>  0, "cssClass" =>  "progress-bar-danger"],
    "BIDDING" =>  ["dbValue" =>  2, "text" =>  "Bidding", "percentage" =>  30,
                "cssClass" =>  ""],
    "ASSIGN_SENT" =>  ["dbValue" =>  3, "text" =>  "Waiting Reply", "percentage" =>  30,
                    "cssClass" =>  "progress-bar-info"],
    "ASSIGN_DEADLINE_REACHED" =>  ["dbValue" =>  4,
                                "text" =>  "Deadline Close", "percentage" =>  30,
                                "cssClass" =>  "progress-bar-warning"],
    "ASSIGN_COMPLETE" =>  ["dbValue" =>  5,
                        "text" =>  "Production Awarded", "percentage" =>  50,
                        "cssClass" =>  "progress-bar-success"],
    "QUESTIONING" =>  ["dbValue" =>  6, "text" =>  "Question Asking", "percentage" =>  60,
                    "cssClass" =>  "progress-bar-warning"],
    "COMMENCED" =>  ["dbValue" =>  7,
                  "text" =>  "Production Commenced", "percentage" =>  60,
                  "cssClass" =>  ""],
    "FINISHED" =>  ["dbValue" =>  8,
                 "text" =>  "Production Finished", "percentage" =>  80,
                 "cssClass" =>  "progress-bar-success"],
    "SHIPPED" =>  ["dbValue" =>  9,
                "text" =>  "Production Shipped", "percentage" =>  100,
                "cssClass" =>  "progress-bar-success"]
];

const DESIGN_STATUS = [
    "INIT" =>  ["dbValue" =>  0, "text" =>  "Assign Designer", "percentage" =>  0,
             "cssClass" =>  "progress-bar-inverse"],
    "WAIT_DRAFTING" =>  ["dbValue" =>  1,
                      "text" =>  "Designer Assigned", "percentage" =>  33,
                      "cssClass" =>  "progress-bar-info"],
    "CHANGES_REQUESTED" =>  ["dbValue" =>  2,
                          "text" =>  "Changes Requested", "percentage" =>  45,
                          "cssClass" =>  "progress-bar-danger"],
    "DRAFTING_UPLOADED" =>  ["dbValue" =>  3,
                          "text" =>  "Waiting Approval", "percentage" =>  70,
                          "cssClass" =>  "progress-bar-warning"],
    "DRAFTING_APPROVED" =>  ["dbValue" =>  4,
                          "text" =>  "Design Approved", "percentage" =>  100,
                          "cssClass" =>  "progress-bar-success"],
];

const PAYMENT_STATUS = [
    "INIT" =>  ["dbValue" =>  0, "text" =>  "No Invoice!", "percentage" =>  0,
             "cssClass" =>  "progress-bar-inverse"],
    "ISSUED" =>  ["dbValue" =>  1, "text" =>  "Invoice issued.", "percentage" =>  20,
               "cssClass" =>  "progress-bar-danger"],
    "OVERDUE" =>  ["dbValue" =>  2, "text" =>  "Invoice Overdue!", "percentage" =>  40,
                "cssClass" =>  "progress-bar-danger"],
    "PARTIAL_PAID" =>  ["dbValue" =>  3,
                     "text" =>  "Partial payment received.", "percentage" =>  60,
                     "cssClass" =>  "progress-bar-warning"],
    "FULLY_PAID" =>  ["dbValue" =>  4, "text" =>  "Fully Paid", "percentage" =>  100,
                   "cssClass" =>  "progress-bar-success"],
];

const SHIPPING_STATUS = [
    "NOT_ASSIGNED" =>  ["dbValue" =>  0, "text" =>  "Not Assigned", "percentage" =>  0,
                     "cssClass" =>  "progress-bar-inverse"],
    "ASSIGNED" =>  ["dbValue" =>  1, "text" =>  "Assigned",
                 "percentage" =>  20, "cssClass" =>  "progress-bar-info"],
    "DISPATCH_SET" =>  ["dbValue" =>  2, "text" =>  "Dispatch Set", "percentage" =>  40,
                     "cssClass" =>  ""],
    "DISPATCH_WARNING" =>  ["dbValue" =>  3, "text" =>  "Dispatch Warning",
                         "percentage" =>  40, "cssClass" =>  "progress-bar-warning"],
    "DISPATCH_LATE" =>  ["dbValue" =>  4, "text" =>  "Dispatch Late", "percentage" =>  40,
                      "cssClass" =>  "progress-bar-danger"],
    "DISPATCHED" =>  ["dbValue" =>  5, "text" =>  "Dispatched", "percentage" =>  70,
                   "cssClass" =>  "progress-bar-info"],
    "EXPECTED_RECEIVE_DATE_WARNING" =>  ["dbValue" =>  6,
                                      "text" =>  "Receive Warning",
                                      "percentage" =>  70,
                                      "cssClass" =>  "progress-bar-warning"],
    "EXPECTED_RECEIVE_DATE_PAST" =>  ["dbValue" =>  7,
                                   "text" =>  "Past Expected Receive Date",
                                   "percentage" =>  70,
                                   "cssClass" =>  "progress-bar-danger"],
    "RECEIVED" =>  ["dbValue" =>  8, "text" =>  "Received", "percentage" =>  100,
                 "cssClass" =>  "progress-bar-success"]
];

function status_info($status, $status_array, $status_string = ""){
    /*Return a status dictionary based on the common.status
        key provided to the 'status_dict' argument and the job progress
        key provided to the status argument. Status_string is used for
        error reporting.
    */
    if(is_null($status)){
        $status = 0;
    }
    foreach($status_array as $value){
        if($value["dbValue"] == $status){
            return $value;
        }
    }
    throw new Exception($status_string . "status was not defined");
}
