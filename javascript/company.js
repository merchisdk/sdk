import { addPropertyTo, getList, fromJson, getOne, serialise,
    patchOne, deleteOne, create, fromJsonList, enumerateFiles,
    Request } from './model.js';
import { Dictionary } from './dictionary.js';
import { AutomaticPaymentRelationship } from './automatic_payment_relationship.js';
import { Address } from './address.js';
import { Bank } from './bank.js';
import { CountryTax, NoTaxEntity } from './country_tax.js';
import { CompanyInvitation } from './company_invitation.js';
import { Domain } from './domain.js';
import { EmailAddress } from './email_address.js';
import { MerchiFile } from './merchi_file.js';
import { PhoneNumber } from './phone_number.js';
import { Product } from './product.js';
import { ShipmentMethod } from './shipment_method.js';
import { User } from './user.js';
import { UserCompany } from './user_company.js';
import { PaymentDevice } from './payment_device.js';

export function Company() {
    this.resource = '/companies';
    this.json = 'company';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'website');
    addPropertyTo(this, 'country');
    addPropertyTo(this, 'stripeAccountId');
    addPropertyTo(this, 'isStripeAccountEnabled');
    addPropertyTo(this, 'logo', MerchiFile);
    addPropertyTo(this, 'defaultCurrency');
    addPropertyTo(this, 'taxNumber');
    addPropertyTo(this, 'taxNumberType');
    addPropertyTo(this, 'defaultTaxType', CountryTax);
    addPropertyTo(this, 'taxTypes', CountryTax);
    addPropertyTo(this, 'paypalAccount');
    addPropertyTo(this, 'paypalPassword');
    addPropertyTo(this, 'paypalSignature');
    addPropertyTo(this, 'isPaypalValid');
    addPropertyTo(this, 'utrustApiKey');
    addPropertyTo(this, 'utrustWebhookKey');
    addPropertyTo(this, 'acceptUtrust');
    addPropertyTo(this, 'isPayingCompany');
    addPropertyTo(this, 'isUtrustValid');
    addPropertyTo(this, 'isTesting');
    addPropertyTo(this, 'isBlocked');
    addPropertyTo(this, 'trialEndDate');
    addPropertyTo(this, 'trialEndDateUpdated');
    addPropertyTo(this, 'trialEndDateSetBy', User);
    addPropertyTo(this, 'sendleActive');
    addPropertyTo(this, 'sendleApiKey');
    addPropertyTo(this, 'sendleId');
    addPropertyTo(this, 'squareAccessToken');
    addPropertyTo(this, 'squareRefreshToken');
    addPropertyTo(this, 'squareExpiresAt');
    addPropertyTo(this, 'squareIsValid');
    addPropertyTo(this, 'squareMerchantId');
    addPropertyTo(this, 'squareWebLocationId');
    addPropertyTo(this, 'stripePublishableKey');
    addPropertyTo(this, 'stripeApiKey');
    addPropertyTo(this, 'stripePublishableTestKey');
    addPropertyTo(this, 'stripeApiTestKey');
    addPropertyTo(this, 'stripeConnectDisabled');
    addPropertyTo(this, 'unltdAiApiOrganizationId');
    addPropertyTo(this, 'unltdAiApiSecretKey');
    addPropertyTo(this, 'isStripeValid');
    addPropertyTo(this, 'acceptSquare');
    addPropertyTo(this, 'acceptStripe');
    addPropertyTo(this, 'acceptPaypal');
    addPropertyTo(this, 'acceptBankTransfer');
    addPropertyTo(this, 'acceptPhonePayment');
    addPropertyTo(this, 'ownershipUnconfirmed');
    addPropertyTo(this, 'userCompanies', UserCompany);
    addPropertyTo(this, 'phoneNumbers', PhoneNumber);
    addPropertyTo(this, 'paymentPhoneNumbers', PhoneNumber);
    addPropertyTo(this, 'emailAddresses', EmailAddress);
    addPropertyTo(this, 'addresses', Address);
    addPropertyTo(this, 'banks', Bank);
    /* products that a company has saved for future reference */
    addPropertyTo(this, 'savedProducts', Product);
    addPropertyTo(this, 'companyInvitations', CompanyInvitation);
    addPropertyTo(this, 'shipmentMethods', ShipmentMethod);
    addPropertyTo(
        this,
        'automaticPaymentRelationships',
        AutomaticPaymentRelationship,
    );
    addPropertyTo(
        this,
        'accessibleDomainsAsClientCompany',
        Domain,
    );
    addPropertyTo(this, 'paymentDevices', PaymentDevice);

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed});
    };
    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {exlcudeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: self.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

   this.invite = function (companyMemberData, success, error, embed) {
        var request = new Request(),
            data = new Dictionary(),
            self = this,
            _id = self.id();

        function handleResponse(status, data) {
            var newInvitation = new CompanyInvitation(),
                invitation = data,
                invitations = self.companyInvitations() ?
                  self.companyInvitations() : [];
            newInvitation.id(invitation.id);
            newInvitation.userEmail(invitation.userEmail);
            newInvitation.userName(invitation.userName);
            newInvitation.inviteAsAdmin(invitation.inviteAsAdmin);
            invitations.push(newInvitation);
            self.companyInvitations(invitations);
            success(self);
        }

        data = new Dictionary();
        data.add("inviteUserEmail", companyMemberData.emailAddress);
        data.add("inviteUserName", companyMemberData.name);
        data.add("company-id", _id);
        data.add("asAdmin", companyMemberData.isAdmin);
        request.resource('/company_invite/').method('POST');
        request.data().merge(data);
        request.responseHandler(handleResponse);
        request.errorHandler(error);
        request.send();
    }

    this.primaryEmailAddressEntity = function () {
        var emails = this.emailAddresses();
        return emails && emails[0] ? emails[0] : null;
    }

    this.primaryEmailAddress = function () {
        var email = this.primaryEmailAddressEntity();
        return email ? email.emailAddress() : null;
    };

    this.primaryPhoneNumberEntity = function () {
        var numbers = this.phoneNumbers();
        return numbers && numbers[0] ? numbers[0] : null;
    }

    this.primaryPhoneNumber = function () {
        var primary = this.primaryPhoneNumberEntity();
        return primary ? primary.internationalFormatNumber() : null;
    };

    this.primaryAddress = function () {
        if (Boolean(this.addresses()) && Boolean(this.addresses()[0])) {
            return this.addresses()[0];
        }
        return null;
    };

    this.stateAndCountryString = function () {
        var self = this;

        if (Boolean(self.primaryAddress())) {
            return self.primaryAddress().stateAndCountryString();
        }
        return 'Address not shared.';
    };

   this.primaryAddressString = function () {
       var self = this;

        if (Boolean(self.primaryAddress())) {
            return self.primaryAddress().fullAddressString();
        }
        return 'Address not shared.';
    };

    this.taxOptions = function () {
        var defaultOptions = this.defaultTaxType(),
            options = [];
        options.push(NoTaxEntity());
        if (defaultOptions) {
            options.push(defaultOptions);
        }
        return options;
    }

   this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };

    this.paymentMethodIsValid = function (methodAttribute) {
        var method = this[methodAttribute]();
        return Array.isArray(method) && method.length > 0 && method[0].id();
    }

    this.arePhonePaymentsValid = function () {
        return this.paymentMethodIsValid('paymentPhoneNumbers');
    }

    this.areBankPaymentsValid = function () {
        return this.paymentMethodIsValid('banks');
    }

    this.logoUrl = function () {
        var logo = this.logo();
        return logo && logo.viewUrl() ? logo.viewUrl() : null;
    }
}

export function Companies() {
    this.resource = '/companies';
    this.json = 'companies';
    this.single = Company;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
