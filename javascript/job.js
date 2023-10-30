import { generateUUID } from './uuid.js';
import { Dictionary } from './dictionary.js';
import { addPropertyTo, getOne, create, serialise, recoverOne, deleteOne,
    fromJson, patchOne, getList, fromJsonList, enumerateFiles,
    Request } from './model.js';
import { isUndefinedOrNull, sortArrayByObjectKeyDescending,
    sortArrayByObjectKey } from './helpers.js';
import { jobStatusProduction, jobStatusDrafting, jobStatusPayment,
    jobStatusShipment } from './job_status.js';
import { roles } from './roles.js';
import { Address } from './address.js';
import { Assignment } from './assignment.js';
import { Product } from './product.js';
import { CountryTax } from './country_tax.js';
import { Company } from './company.js';
import { MerchiFile } from './merchi_file.js';
import { Draft } from './draft.js';
import { DraftComment } from './draft_comment.js';
import { Domain } from './domain.js';
import { DomainTag } from './domain_tag.js';
import { EmailAddress } from './email_address.js';
import { Invoice } from './invoice.js';
import { Notification } from './notification.js';
import { Shipment } from './shipment.js';
import { PhoneNumber } from './phone_number.js';
import { MatchingInventory } from './matching_inventory.js';
import { User } from './user.js';
import { Variation } from './variation.js';
import { VariationsGroup } from './variations_group.js';
import { JobComment } from './job_comment.js';
import { InternalTag } from './internal_tag.js';


export function Job() {
    this.resource = '/jobs';
    this.json = 'job';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'quantity');
    addPropertyTo(this, 'notes');
    addPropertyTo(this, 'jobType');
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'supplyChainRequestProduct', Product);
    addPropertyTo(this, 'createdProducts', Product);
    addPropertyTo(this, 'priority');
    addPropertyTo(this, 'received');
    addPropertyTo(this, 'deadline');
    addPropertyTo(this, 'updated');
    addPropertyTo(this, 'deductionDate');
    addPropertyTo(this, 'preDraftCommentsCount');
    addPropertyTo(this, 'clientFiles', MerchiFile);
    addPropertyTo(this, 'productionFiles', MerchiFile);
    addPropertyTo(this, 'drafts', Draft);
    addPropertyTo(this, 'ownDrafts', Draft);
    addPropertyTo(this, 'sharedDrafts', Draft);
    addPropertyTo(this, 'draftComments', DraftComment);
    addPropertyTo(this, 'comments', JobComment);
    addPropertyTo(this, 'invoice', Invoice);
    addPropertyTo(this, 'shipment', Shipment);
    addPropertyTo(this, 'client', User);
    addPropertyTo(this, 'clientEmail', EmailAddress);
    addPropertyTo(this, 'clientPhone', PhoneNumber);
    addPropertyTo(this, 'clientCompany', Company);
    addPropertyTo(this, 'clientCompanyEmail', EmailAddress);
    addPropertyTo(this, 'clientCompanyPhone', PhoneNumber);
    addPropertyTo(this, 'manager', User);
    addPropertyTo(this, 'designer', User);
    addPropertyTo(this, 'shipping', Address);
    addPropertyTo(this, 'dropShip');
    addPropertyTo(this, 'pickUp');
    addPropertyTo(this, 'productionShippingAddress', Address);
    addPropertyTo(this, 'supplyAssignment', Assignment);
    addPropertyTo(this, 'supplyJob', Job);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'cost');
    addPropertyTo(this, 'taxAmount');
    addPropertyTo(this, 'totalCost');
    addPropertyTo(this, 'taxType', CountryTax);
    addPropertyTo(this, 'costPerUnit');
    addPropertyTo(this, 'automaticPriceEnabled');
    addPropertyTo(this, 'tags', DomainTag);

    // not embedded by default
    addPropertyTo(this, 'unreadNotificationsCount');
    addPropertyTo(this, 'unreadJobInfoNotificationsCount')
    addPropertyTo(this, 'unreadJobDraftingNotificationsCount');
    addPropertyTo(this, 'unreadJobProductionNotificationsCount');
    addPropertyTo(this, 'unreadJobShippingNotificationsCount');
    addPropertyTo(this, 'unreadJobInvoicingNotificationsCount');
    addPropertyTo(this, 'matchingInventories', MatchingInventory);
    addPropertyTo(this, 'inventoryCount');
    addPropertyTo(this, 'inventorySufficient');
    addPropertyTo(this, 'limitedStock');
    addPropertyTo(this, 'canDeduct');

    addPropertyTo(this, 'productionNotes');
    addPropertyTo(this, "needsDrafting");
    addPropertyTo(this, "needsGroupBuy");
    addPropertyTo(this, "needsProduction");
    addPropertyTo(this, "needsShipping");
    addPropertyTo(this, "needsInvoicing");
    addPropertyTo(this, "needsSupplyChainRequest");
    addPropertyTo(this, 'hasValidVolumes');
    addPropertyTo(this, 'hasValidWeights');
    addPropertyTo(this, 'showProductionFilesToClient');
    addPropertyTo(this, 'allowClientDraftContribution');
    addPropertyTo(this, 'groupBuyStatus');
    addPropertyTo(this, 'groupBuyProductionStarted');
    addPropertyTo(this, 'shippingStatus');
    addPropertyTo(this, 'designStatus');
    addPropertyTo(this, 'paymentStatus');
    addPropertyTo(this, 'productionStatus');
    addPropertyTo(this, 'supplyChainRequestStatus');
    addPropertyTo(this, 'assignments', Assignment);
    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'notifications', Notification);
    addPropertyTo(this, 'variationsGroups', VariationsGroup);
    addPropertyTo(this, 'variations', Variation);
    addPropertyTo(this, 'jobVolume');
    addPropertyTo(this, 'jobWeight');
    addPropertyTo(this, 'completed');
    addPropertyTo(this, 'jobInfoApprovedByClient');
    addPropertyTo(this, 'quoteSet');
    addPropertyTo(this, 'shopifyShopUrl');
    addPropertyTo(this, 'shopifyOrderId');
    addPropertyTo(this, 'shopifyOrderLineItemId');
    addPropertyTo(this, 'internalTags', InternalTag);

    this.create = function (
        success, error, embed, asDomain, withRights) {
        var data = serialise(this),
            self = this,
            settings = {
                as_domain: asDomain,
                embed: embed,
                error: error,
                files: enumerateFiles(data[1]),
                parameters: data[0],
                resource: this.resource,
                withRights: withRights};
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        settings.success = handleResponse;
        create(settings);
    };
    this.publicCreate = function (success, error) {
        var data = serialise(this),
            self = this,
            request = new Request(),
            jobType = this.product() && this.product().productType() === 0 ?
                'mod' : 'supplier';
        request.data().merge(data[0]);
        request.resource(`/public-${jobType}-quote/`);
        request.method('POST');
        request.query().add('skip_rights', true);
        function handleResponse(status, data) {
            if (status === 201) {
                success(fromJson(self, data[self.json]));
            } else {
                error(data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(error);
        request.send();
    };

    this.get = function (success, error, embed, includeArchived,
                         withRights) {
        var self = this,
            parameters = {
                embed: embed,
                error: error,
                id: this.id(),
                includeArchived: includeArchived,
                withRights: withRights,
                resource: this.resource};
        function handleResponse(data) {
            success(fromJson(self, data[self.json],
                             {makesDirty: false}));
        }
        parameters.success = handleResponse;
        getOne(parameters);
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };

    this.recover = function (success, error) {
        recoverOne("jobs", this.id(), success, error);
    };

   this.patch = function (
        success, error, embed, asDomain, withRights) {
        var self = this,
           data = serialise(this, undefined, undefined, undefined,
                              {excludeOld: true})[0],
            domain = Boolean(self.domain()) ? self.domain().id() : null,
            domainId = isUndefinedOrNull(asDomain) ? domain : asDomain,
            settings = {
                as_domain: domainId,
                data: data,
                embed: embed,
                error: error,
                id: this.id(),
                 withRights: withRights,
               resource: this.resource};
        function handleResponse(data) {
             success(fromJson(self, data[self.json],
                             {makesDirty: false}));
        }
        settings.success = handleResponse;
        patchOne(settings);
    };

    this.hasVariations = function () {
        var variations = this.variations();
        return Boolean(variations) && variations.length > 0;
    };

    this.hasVariationsGroups = function () {
        var groups = this.variationsGroups();
        return Boolean(groups) && groups.length > 0;
    };

    this.variationGroupsTotalQuantity = function () {
        var self = this,
            groups = Boolean(self.variationsGroups()) ?
                self.variationsGroups() : [],
            totalQuantity = 0,
            group, groupQuantity, i;
        for (i = 0; i < groups.length; i++) {
            group = groups[i];
            groupQuantity = isNaN(group.quantity()) ? 0 : group.quantity();
            totalQuantity += parseInt(groupQuantity, 10);
        }
        return totalQuantity;
    };

    this.productTotalCost = function () {
        var costPerUnit = this.costPerUnit() ? this.costPerUnit() : 0,
            qty = this.quantity() ? this.quantity() : 0;
        return costPerUnit * qty;
    };

    this.loopVariationsAndReturnAttributeTotal = function (attribute) {
        var variations = this.variations() ?
                this.variations() : [],
            total = 0,
            i;
        for (i = 0; i < variations.length; i++) {
            total += variations[i][attribute]();
        }
        return parseFloat(total).toFixed(2);
    };

    this.variationsUnitCostAndOnceOffCost = function () {
        return this.loopVariationsAndReturnAttributeTotal(
            'unitCostAndOnceOffCost');
    };

    this.variationsTotalCost = function () {
        return this.loopVariationsAndReturnAttributeTotal(
            'unitCostTotalAndOnceOffCost');
    }

    this.assignmentsUnarchived = function () {
        var assignments = this.assignments() ? this.assignments() : [],
            unarchived = [],
            i;
        for (i = 0; i < assignments.length; i++) {
            if (!assignments[i].archived()) {
                unarchived.push(assignments[i]);
            }
        }
        return unarchived;
    };

    this.productionAcceptedAssignment = function () {
        var assignments = this.assignmentsUnarchived(),
             i;
        for (i = 0; i < assignments.length; i++) {
            if (assignments[i].managerAccepts()) {
                return assignments[i];
            }
        }
        return null;
    };

   this.productionQuotingComplete = function () {
         return this.productionStatus() >=
            jobStatusProduction.get('ASSIGN_DEADLINE_REACHED');
    };

    this.sectionReached = function (jobAttribute, sectionState) {
        var job = this,
            section = job[jobAttribute]();
        return section && section >= sectionState;
    }

    this.productionComplete = function () {
        var isShipped =
            this.sectionReached('productionStatus',
                jobStatusProduction.get('SHIPPED'));
        var isCompleted =
            this.sectionReached('productionStatus',
                jobStatusProduction.get('COMPLETED'));
        return isShipped || isCompleted || !this.needsProduction();
    }

    this.draftingComplete = function () {
        return this.sectionReached('designStatus',
            jobStatusDrafting.get('DRAFTING_APPROVED')) ||
            !this.needsDrafting();
    }

    this.paymentComplete = function () {
        return this.sectionReached('paymentStatus',
            jobStatusPayment.get('FULLY_PAID'));
    }

    this.shippingComplete = function () {
        return this.sectionReached('shippingStatus',
            jobStatusShipment.get('RECEIVED')) ||
            !this.needsShipping();
    }

    this.isComplete = function () {
        return this.productionComplete() && this.draftingComplete() &&
            this.paymentComplete() && this.shippingComplete();
    }

    this.assignmentArrayIndexById = function (assignmentId) {
        return this.assignments().findIndex(function (assignment) {
            return assignmentId === assignment.id();
        });
    };

    this.setAssignment = function (assignment) {
        var assignmentIndex = this.assignmentArrayIndexById(
            assignment.id()),
            assignments = this.assignments();
        assignments[assignmentIndex] = assignment;
        return assignments;
    }

    this.assignmentBySupplier = function (supplier) {
        var assignments = this.assignmentsUnarchived(),
           i;
        for (i = 0; i < assignments.length; i++) {
            if (assignments[i].isUserSupplier(supplier)) {
                return assignments[i];
            }
        }
        return null;
    };

    this.findAssignmentById = function (assignmentId) {
        var self = this,
            index = self.assignmentArrayIndexById(assignmentId);
        if (!isNaN(index) && index !== -1) {
            return self.assignments()[index];
        }
        return null;
    };

    this.fetchAndUpdateAssignmentById = function (success, error,
                                                  assignmentId, embed) {
        var self = this,
            assignment = self.findAssignmentById(assignmentId),
            index = self.assignmentArrayIndexById(assignmentId);
        if (Boolean(assignment)) {
            assignment.get(function (latestAssignment) {
                self.assignments()[index] = latestAssignment;
                success();
            }, error, embed);
        } else {
            error();
        }
    };

    this.assignedSupplierIdArray = function () {
        // return an array of suppliers who have assignments
        var assignments = this.assignmentsUnarchived(),
            supplierIds = [],
            i;
        for (i = 0; i < assignments.length; i++) {
            supplierIds.push(assignments[i].supplier().id());
        }
        return supplierIds;
    };

    this.updateDateOfAssignments = function (newDate, dateAttribute) {
        var assignments = this.assignmentsUnarchived(),
            i;
        for (i = 0; i < assignments.length; i++) {
            // new date should be in current user unix local time
            assignments[i][dateAttribute](newDate);
        }
        return assignments
    };

    this.firstAssignment = function () {
        return this.assignmentsUnarchived()[0];
    };

    this.productionShipment = function () {
        var acceptedAssignment = this.productionAcceptedAssignment();
        return Boolean(acceptedAssignment) ?
            acceptedAssignment.shipment() : null;
    };

    this.productionDeadline = function () {
        var firstAssignment = this.firstAssignment();
        return firstAssignment ?
            firstAssignment.productionDeadline() : null;
    };

    this.assignmentDeadline = function () {
        var firstAssignment = this.firstAssignment();
        return firstAssignment ?
            firstAssignment.assignmentDeadline() : null;
    }

    this.productionAssignmentDeadline = function () {
        return this.assignmentDeadline();
    };

    this.originalProduct = function () {
      var product = this.product();
      if (product) {
        var original = product.originalProduct();
        return original ? original : product;
      }
      return product;
    };

   this.draftsYoungestToEldest = function () {
        var drafts = this.drafts();
        return drafts ?
            sortArrayByObjectKeyDescending(drafts, 'date') : [];
    };

    this.draftsEldestToYoungest = function () {
        var drafts = this.drafts();
        return drafts ? sortArrayByObjectKey(drafts, 'date') : [];
    };

    this.currentDraft = function () {
        return this.draftsYoungestToEldest()[0];
    }

    this.draftIndexEldestToYoungest = function (draft) {
        return this.draftsEldestToYoungest().
            findIndex(function (draftEntity) {
                return draft.id() === draftEntity.id();
            });
    }

    this.draftCommentsYoungestToEldest = function () {
        return sortArrayByObjectKeyDescending(this.draftComments(), 'date');
    }

    this.allDraftCommentsYoungestToEldest = function () {
        var jobDraftComments = this.draftCommentsYoungestToEldest(),
            drafts = this.draftsYoungestToEldest(),
            draftComments = [],
            i;
        for (i = 0; i < drafts.length; i++) {
            draftComments.concat(drafts[i].commentsYoungestToEldest());
        }
        return draftComments.concat(jobDraftComments);
    }

    this.activeDraft = function () {
        var drafts = this.draftsYoungestToEldest();
        return drafts.length > 0 ? drafts[0] : null;
    }

    this.shippingIsValid = function () {
        return this.shipping() && this.shipping().isValid();
    }

    this.userCanViewSection = function (user, allowedRoles) {
        var domain = this.domain();
        return domain ?
            user.hasAuthority(domain.id(), allowedRoles) : false;
    }

    this.isAdminOrManager = function (user) {
        return user.isAdminOrManager(this.domain().id());
    }

    this.isClient = function (user) {
        var clientId = this.client() ? this.client().id() : null;
        return clientId && user.id() === clientId;
    }

    this.userCanViewInfo = function (user) {
        var manager = roles.get('manager'),
            admin = roles.get('admin'),
            designer = roles.get('designer'),
            sales = roles.get('sales'),
            supplier = roles.get('supplier'),
            accountant = roles.get('accountant');
        return this.userCanViewSection(user,
            [manager, admin, designer, sales, supplier, accountant]);
    }

     this.userCanViewDrafting = function (user) {
       var client = roles.get('client'),
            manager = roles.get('manager'),
            admin = roles.get('admin'),
            designer = roles.get('designer');
        return this.userCanViewSection(user,
            [client, manager, admin, designer]);
    }

    this.userCanViewProduction = function (user) {
        var manager = roles.get('manager'),
            admin = roles.get('admin'),
            supplier = roles.get('supplier');
        return this.userCanViewSection(user,
            [manager, admin, supplier]);
    }

    this.userCanViewShipping = function (user) {
        var manager = roles.get('manager'),
            admin = roles.get('admin'),
            client = roles.get('client');
        return this.userCanViewSection(user,
            [manager, admin, client]);
    }

    this.userCanViewInvoice = function (user) {
        var manager = roles.get('manager'),
            admin = roles.get('admin'),
            accountant = roles.get('accountant');
        return this.userCanViewSection(user,
            [manager, admin, accountant]);
    }

    this.userHasRole = function (user, roles) {
        var domain = this.domain();
        return user.hasAuthority(domain.id(), roles);
    }
    this.tax = function () {
        var domain = this.domain();
        return domain && domain.company() ?
            domain.company().defaultTaxType() : null;
    }

    this.isUserClient = function (user) {
        var client = this.client();
        return client && client.id() === user.id();
    }

    this.isUserManager = function (user) {
        var manager = this.manager();
        return manager && manager.id() === user.id();
    }

    this.isUserAdminOrManagerOfDomain = function (user) {
        var domain = this.domain();
        return domain ?
          user.isAdminOrManager(domain.id()) : false
    }

    this.isUserAssignmentSupplier = function (user) {
        var assignment = this.assignmentBySupplier(user);
        return assignment ? assignment.isUserSupplier(user) : false;
    }

   this.tryDeduct = function (success, error) {
        var request = new Request(),
            data = serialise(this)[0],
            query = new Dictionary(),
            self = this;
        query.add('embed', JSON.stringify({inventory: {}}));
        request.resource('/jobs/' + this.id() + '/deduct/');
        request.method('POST');
        request.data().merge(data);
        request.query().merge(query);
        function handleResponse(status, data) {
            if (status === 200) {
                success(fromJson(self, data['job']));
            } else {
                error(data);
            }
        }
        function handleError() {
            error({message: 'could not connect to server',
                   errorCode: 0});
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }
}

export function Jobs() {
    this.resource = '/jobs';
    this.json = 'jobs';
    this.single = Job;

    this.get = function (success, error, parameters, withUpdates) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        return getList(this.resource, handleResponse, error, parameters,
                       withUpdates);
    };
}
