<?php

require_once 'entity.php';
require_once 'users.php';
require_once 'products.php';
require_once 'job_comments.php';
require_once 'draft_comments.php';
require_once 'production_comments.php';
require_once 'country_taxes.php';
require_once 'domains.php';
require_once 'drafts.php';
require_once 'invoices.php';
require_once 'files.php';
require_once 'addresses.php';
require_once 'bids.php';
require_once 'shipments.php';
require_once 'companies.php';
require_once 'specifications.php';
require_once 'notifications.php';

require_once './../php_aux/business_default.php';
require_once './../php_aux/roles.php';
require_once './../php_aux/status.php';
require_once './../php_aux/notifcation_sources.php';

class Job extends Entity
{
    public static $json_name = 'Job';
    public static $resource = '/jobs/';


    public function __construct() {
        $this->escape_fields = ['product', 'quantity', 'tax_type'];
        $this->json_property('id', 'integer');
        $this->json_property('manager','User', $many = False,
                             $recursive = True);
        $this->json_property('designer','User', $many = False,
                             $recursive = True);
        $this->json_property('client','User', $many = False,
                             $recursive = True);
        $this->json_property('product','Product', $many = False,
                             $recursive = True);
        $this->json_property('comments','JobComment', $many = True,
                             $recursive = True);
        $this->json_property('draft_comments','DraftComment', $many = True,
                             $recursive = True);
        $this->json_property('drafts','Draft', $many = True,
                             $recursive = True);
        $this->json_property('invoice','Invoice', $many = False,
                             $recursive = True);
        $this->json_property('shipping','Address', $many = False,
                             $recursive = True);
        $this->json_property('production_shipping_address','Address', $many = False,
                             $recursive = True);
        $this->json_property('notifications','Notification', $many = True,
                             $recursive = True);
        $this->json_property('client_company','Company', $many = False,
                             $recursive = True);
        $this->json_property('quantity', 'integer');
        $this->json_property('notes', 'string');
        $this->json_property('production_notes', 'string');
        $this->json_property('completed', 'boolean');
        $this->json_property('archived', 'boolean');
        $this->json_property('priority', 'integer');
        $this->json_property('cost_per_unit', 'float');
        $this->json_property('tax_amount', 'float');
        $this->json_property('automatic_price_enabled', 'boolean');
        $this->json_property('cost', 'integer');
        $this->json_property('job_weight', 'float');
        $this->json_property('job_volume', 'float');
        $this->json_property('needs_production', 'boolean');
        $this->json_property('needs_drafting', 'boolean');
        $this->json_property('needs_shipping', 'boolean');
        $this->json_property('domain', 'string');
        $this->json_property('deadline', 'integer', $default = NULL);
        $this->json_property('production_status', 'integer');
        $this->json_property('design_status', 'integer');
        $this->json_property('shipping_status', 'integer');
        $this->json_property('payment_status', 'integer');
        $this->json_property('domain', 'string');]
        $this->json_property('received', 'DateTime');
        $this->json_property('deadline', 'DateTime');
        $this->json_property('updated', 'DateTime');
        $this->json_property('product', 'Product', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('domain', 'Domain', $many = False,
                             $default = '1', $recursive = True);
        $this->json_property('clientFile', 'File', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('productionFile', 'File', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('assignments', 'Assignment', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('specifications_groups', 'SpecificationsGroup', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('specifications', 'Specification', $default = [],
                             $many = true, $recursive = True);
        $this->json_property('shipment', 'Shipment',
                             $many = False, $recursive = True);
        $this->json_property('tax_type', 'CountryTax',
                             $many = False, $recursive = True);
    }

    function product_total_cost(){
        /*Return the cost_per_unit multiplied by the total job
            quantity
        */
        return $this->quantity * $this->cost_per_unit;
    }

    function process_for_transfer(){
        $this->updated = NULL;
    }

    function is_draft_accepted(){
        /*Return True if the current draft for this job has been accepted,
            or False otherwise.
        */
        try {
            $current_draft = $this->drafts[0];
        } catch (Exception $e) {
            return False;
        }
        if ($current_draft->accepted){
            return True;
        }else {
            return False;
        }
    }

    function priority_name(){
        /*Return a string from one of the constants defined in
            common.business_default that represents the priority of this job.
        */
        $return_value = array_key_exists($this->priority, $PRIORITY_OPTIONS_REVERSE_MAP)
        ? $PRIORITY_OPTIONS_REVERSE_MAP[$this->priority] : LOW_STRING;
    }

    function current_draft(){
        #Return the most recent job draft from an array of job drafts
        if(sizeof($this->drafts) > 0){
            return $this->drafts[0];
        } else {
            return NULL;
        }
    }

    function most_recent_draft_id(){
        /*Return the current draft id for the job or None if no drafts.
            Requires that the draft objects be embedded when fetching
            this job object.
        */
        if (sizeof($this->drafts == 0)){
            return NULL;
        } else{
            return $this->drafts[0]->id;
        }
    }

    function supplier($only_aproved = False){
        /*Return either a list of suppliers, a single supplier, or None,
            depending on what stage the job is in and what suppliers have
            been assigned. Requires that assignments.supplier be embedded
            with the job when fetching it.
        */
        if($this->assignments){
            if($only_aproved){
                foreach($this->assignments as $assign){
                    if($assign->manager_accepts){
                        return $assign->supplier;
                    }
                }
            }else {
                $return_val = array();
                foreach($this->assignments as $assign){
                    $return_val[] = $assign->supplier;
                }
                return $return_val;
            }
        }
    }

    function is_production_in_house(){
        #Return True if one of the job assignment suppliers is a manager
        foreach($this->assignments as $assign){
            if($assign->supplier->has_authority($this->domain->id,[ADMIN, MANAGER])){
                return True;
            }
        }
        return False;
    }

    function in_house_assignment(){
        #Return an assignment if the assignment is in-house
        if($this->is_production_in_house()){
            return $this->assignments[0];
        }
        return NULL;
    }

    function accepted_assignment(){
        #Return the production assignment accepted by the manager
        foreach($this->assignments as $assign){
            if($assign->manager_accepts){
                return $assign;
            }
        }
        return NULL;
    }

    function assignment_deadline(){
        #Return the assignment deadline from one of the assignments
        if(sizeof($this->assignments) > 0){
            return $this->assignments[0]->assignment_deadline;
        }
        return NULL;
    }

    function assignment_by_supplier_id($user_id){
        /*Return a job assignment associated with
            the user provided and return None if no assignment can
            be found with the user.
        */
        $assignment  = NULL;
        foreach($this->assignments as $assign){
            if($assign->supplier->id === $user_id){
                $assignment = $assign;
            }
        }
        return $assignment;
    }

    function production_shipment(){
        /*Return the shipment object which has been created for production
            procedure.
        */
        foreach($this->assignments as $assign){
            if($assign->shipment){
                return $assign->shipment;
            }
        }
        return NULL;
    }

    function production_display_info(){
        /*Return the PRODUCTION_STATUS dict from
            common.status with the values based on the job.production_status
        */
        return status_info($this->design_status, DESIGN_STATUS, "design ");
    }

    function payment_display_info(){
        /*Return the PAYMENT_STATUS dict from
            common.status with the values based on the job.payment_status
        */
        return status_info($this->payment_status, PAYMENT_STATUS, "payment ");
    }

    function shipment_display_info(){
        /*Return the SHIPPING_STATUS dict from common.status with the values
            based on the job.shipping_status
        */
        return status_info($this->shipping_status, SHIPPING_STATUS, "shipment ");
    }

    function supplier_shipment_info(){
        #Return the shipping information submitted buy the supplier
        $assignment = $this->accepted_assignment();
        if($assignment){
            return $assignment->shipment;
        }
        return NULL;
    }

    function product_unit_price(){
        /*Display the product unit_price. This value takes into consideration
            discounted unit price based on server calculated product unit price
            after it got discounted
        */
        return $this->cost_per_unit;
    }

    function assignment_earliest_production(){
        /* Return the assignment which is able to get the
          production completed in the fastest amount of time
        */
        $earliest_deadline = NULL;
        $earliest_supplier = NULL;
        foreach($this->assignments as $assign){
            if($assign->bid){
                $agreed_deadline = $assign->bid->agreed_deadline;
                if(!$earliest_deadline or $agreed_deadline < $earliest_deadline){
                    $earliest_deadline = $assign->bid->agreed_deadline;
                    $earliest_supplier = $assign;
                }
            }
        }
        return $earliest_supplier;
    }

    function assignment_lowest_bid(){
        #Return the lowest bid out of all the assignments
        $lowest_bid = NULL;
        $lowest_supplier = NULL;
        foreach($this->assignments as $assign){
            if($assign->bid){
                if(!$lowest_bid or $assign->bid->bid_total() < $lowest_bid){
                    $lowest_bid = $assign->bid->bid_total();
                    $lowest_supplier = $assign;
                }
            }
        }
        return $lowest_supplier;
    }

    function get_section_name($section){
        /*Generate section name that can be used to generate private attribute
            to store notifications info of different sections in job.
        */
        $fmt = "_%s_notifications_";
        if(!$section){
            return sprintf($fmt, "all");
        }
        return sprintf($fmt, JOB_SECTION_STRINGS[$section]);
    }

    function inject_notifications($tab="unread", $section = NULL){
        $notifications_embed = ['domain' => ['logo' => []],
                                'relatedJob' => [],
                                'sender' => ['profilePicture' => []]];
        $query = ["tab" => $tab,
                  "related_job" => $this->id,
                  "section" => $section,
                  "sort" => "id",
                  "order" => "desc"];
    }
}

class Jobs extends Resource
{
    public function __construct(argument)
    {
        $this->entity_class = 'Job';
        $this->json_name = 'jobs';
    }
}

class Assignment extends Entity
{
    public static $resource = '/assignments/';
    public static $json_name = 'assignment';

    public function __construct()
    {
        $this->json_property('id', 'integer');
        $this->json_property('manager_accepts', 'string');
        $this->json_property('supplier_refused', 'string');
        $this->json_property('production_deadline', 'DateTime');
        $this->json_property('assignment_deadline', 'DateTime');
        $this->json_property('job', 'Job',
                             $many = False, $recursive = True);
        $this->json_property('supplier', 'User',
                             $many = False, $recursive = True);
        $this->json_property('bid', 'Bid',
                             $many = False, $recursive = True);
        $this->json_property('comments', 'ProductionComment',
                             $many = True, $recursive = True);
        $this->json_property('shipment', 'Shipment',
                             $many = False, $recursive = True);
        $this->json_property('notifications', 'Notification',
                             $many = True, $recursive = True);
    }
}

class Assignments extends Resource
{
    public function __construct(argument)
    {
        $this->entity_class = 'Assignment';
        $this->json_name = 'assignments';
    }
}

$jobs = new Jobs();
$assignments = new Assignments();
