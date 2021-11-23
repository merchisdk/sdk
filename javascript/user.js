import { generateUUID } from './uuid';
import moment from 'moment-timezone';
import { Set } from './set';
import { md5 } from './md5';
import {  COMPONENT_BUILDER, roles, systemRoles, allRoles } from './roles';
import { any, isUndefinedOrNull } from './helpers';
import { addPropertyTo, getList, fromJsonList, serialise, getOne, fromJson,
    create, enumerateFiles, patchOne, Request } from './model';
import { Address } from './address';
import { EmailAddress } from './email_address';
import { EnrolledDomain } from './enrolled_domain';
import { PhoneNumber } from './phone_number';
import { Product } from './product';
import { MerchiFile } from './merchi_file';
import { SystemRole } from './system_role';
import { UserCompany } from './user_company';

export function User() {
    this.resource = '/users';
    this.json = 'user';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'password');
    addPropertyTo(this, 'resetToken');
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'timezone');
    addPropertyTo(this, 'preferredLanguage');
    addPropertyTo(this, 'isSuperUser');
    addPropertyTo(this, 'systemRoles', SystemRole);
    addPropertyTo(this, 'enableCrashReports');
    addPropertyTo(this, 'enableClientEmails');
    addPropertyTo(this, 'enableInvoiceReminders');
    addPropertyTo(this, 'enableStoreNotifications');
    addPropertyTo(this, 'phoneNumbers', PhoneNumber);
    addPropertyTo(this, 'emailAddresses', EmailAddress);
    addPropertyTo(this, 'addresses', Address);
    addPropertyTo(this, 'userCompanies', UserCompany);
    addPropertyTo(this, 'enrolledDomains', EnrolledDomain);
    addPropertyTo(this, 'profilePicture', MerchiFile);
    /* products that a supplier can produce */
    addPropertyTo(this, 'products', Product);
    /* products that a user has saved for future reference */
    addPropertyTo(this, 'savedProducts', Product);

    this.create = function (success, error, embed, as_domain) {
        var self = this,
            data = serialise(self);
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
    this.publicCreate = function (success, error) {
        var data = serialise(this),
            self = this,
            request = new Request(),
            result = '',
            jsonBody;
        request.data().merge(data[0]);
        request.resource('/public-user-create/');
        request.method('POST');
        function handleResponse(status, body) {
            if (status === 201) {
                try {
                    jsonBody = JSON.parse(body);
                    result = fromJson(self, jsonBody[self.json]);
                    success(result);
                } catch (e) {
                    result = {message: 'invalid json from server'};
                    error(status, result);
                }
            } else {
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    result = {message: 'Unable to create user.'};
                }
                error(status, result);
            }
        }
        function handleError(status, body) {
            try {
                result = JSON.parse(body);
            } catch (e) {
                result = {message: 'Invalid json from server',
                          errorCode: 0};
            }
            error(status, result);
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    };

    this.patch = function (success, error, embed, asDomain) {
        var self = this,
            data = serialise(self, undefined, undefined, undefined,
                             {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  as_domain: asDomain,
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.update = function (success, error, embed) {
        this.patch(success, error, embed);
    };

   this.isRegistered = function() {
        var id = this.id();
        return !isUndefinedOrNull(id) && id > 0;
    }

    this.enrolledDomainByDomainId = function (domainId) {
        var i, enrolledDomains = this.enrolledDomains();
        for (i = 0; i < enrolledDomains.length; i++) {
            var domain = enrolledDomains[i].domain();
            if (domain && domain.id() === domainId) {
                return enrolledDomains[i];
            }
        }
        return null;
    }

    this.roleInDomain = function (domainId) {
        var enrolledDomains = this.enrolledDomainByDomainId(domainId);
        return enrolledDomains ? enrolledDomains.role() : roles.get("public");
    };

    this.hasAuthority = function (domainId, roles) {
        var i, domainRole = this.roleInDomain(domainId);
        if (this.isSuperUser()) {
            return true;
        }
        for (i = 0; i < roles.length; i++) {
            if (roles[i] === domainRole) {
                return true;
            }
        }
        return false;
    };

    this.isJobsAssignee = function (domainId) {
        var enrolledDomain = this.enrolledDomainByDomainId(domainId);
        return enrolledDomain ? enrolledDomain.isJobsAssignee() : false;
   };

    this.isAdmin = function (domainId) {
        return this.hasAuthority(domainId, [roles.get('admin')]);
    };

    this.isAdminOrManager = function (domainId) {
        var managerRole = roles.get('manager'),
            adminRole = roles.get('admin');
        return this.hasAuthority(domainId, [managerRole, adminRole]);
    };

    this.canEditInvoice = function (domainId) {
        var managerRole = roles.get('manager'),
            adminRole = roles.get('admin'),
            accountantRole = roles.get('accountant');
        return this.hasAuthority(
            domainId, [managerRole, adminRole, accountantRole]);
    }


    this.canEditTheme = function (domainId) {
        var managerRole = roles.get('manager'),
            adminRole = roles.get('admin'),
            themeRole = roles.get('theme editor');
        return this.hasAuthority(
            domainId, [managerRole, adminRole, themeRole]);
     }

    this.allRoles = function () {
        var rolesSet = new Set(), i,
            enrolledDomains = this.enrolledDomains();
        if (this.isSuperUser()) {
            return allRoles;
        }
        for (i = 0; i < enrolledDomains.length; i++) {
            rolesSet.add(enrolledDomains[i].role());
        }
        rolesSet.add(roles.get("public"));
        return rolesSet;
    };
    this.hasRole = function (roles, combineFunction) {
       var userRoles = this.allRoles(), i,
            isRoleInJudgementResult = [];
        if (!combineFunction) {
            combineFunction = any;
        }
        for (i = 0; i < roles.length; i++) {
            isRoleInJudgementResult.append(userRoles.has(roles[i]));
        }
        return combineFunction(isRoleInJudgementResult);
    };

    this.hasRoleInAnyDomain = function (rolesArray) {
        var i, hasRole = false;
        this.allRoles().each(function(roleInt) {
            for (i = 0; i < rolesArray.length; i++) {
                if (roleInt === rolesArray[i]) {
                    hasRole = true;
                }
            }
        });
        return hasRole;
    }

    this.domainsByRoles = function (rolesArray) {
        /* takes an array of roles and returns an array of domains where
           the user has one of the provided roles.
        */
        var enrolledDomains = this.enrolledDomains() ?
                this.enrolledDomains() : [],
            domains = [],
            domain,
            i;
        for (i = 0; i < enrolledDomains.length; i++) {
            domain = enrolledDomains[i].domain();
            if (domain && this.hasAuthority(domain.id(), rolesArray)) {
                domains.push(domain);
            }
        }
        return domains;
    }

    this.update = function (success, error, embed) {
        this.patch(success, error,
                   serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0], embed);
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

    this.inDomain = function (domainId) {
        var i,
            domain,
            userDomains = this.enrolledDomains();
        for (i = 0; i < userDomains.length; i += 1) {
            domain = userDomains[i].domain();
            if (domain && domain.id() === parseInt(domainId, 10)) {
                return true;
            }
        }
        return false;
    };

    this.managedDomains = function () {
        var domains = [],
            i,
            enrolment,
            userDomains = this.enrolledDomains();
        for (i = 0; i < userDomains.length; i += 1) {
            enrolment = userDomains[i];
            if (enrolment.role() === roles.get('admin') ||
                    enrolment.role() === roles.get('manager')) {
                domains.push(enrolment.domain());
            }
        }
        return domains;
    }

    this.supplierDesignerDomains = function () {
        var domains = [],
            i,
            enrolment,
            userDomains = this.enrolledDomains();
        for (i = 0; i < userDomains.length; i += 1) {
            enrolment = userDomains[i];
            if (enrolment.role() === roles.get('designer') ||
                    enrolment.role() === roles.get('supplier')) {
                domains.push(enrolment.domain());
            }
        }
        return domains;
    }
    this.hasSystemRole = function (systemRole) {
        var systemRoles = this.systemRoles() ? this.systemRoles() : [],
            i;
        for (i = 0; i < systemRoles.length; i++) {
            if (systemRoles[i].role() === systemRole) {
                return true;
            }
        }
        return false;
    };

    this.isPlatformStaff = function() {
        return this.isSuperUser() || this.hasSystemRole();
    };

    this.isComponentBuilder = function () {
        return this.hasSystemRole(systemRoles.get(COMPONENT_BUILDER));
    };

   this.indexOfSystemRole = function (systemRole) {
        var systemRoles = this.systemRoles() ? this.systemRoles() : [];
        return systemRoles.findIndex(function(ent) {
            return systemRole === ent.role();
        });
    };

    this.userLocalTime = function (time) {
        return moment(time).tz(this.timezone()).toDate();
    };

    this.userLocalTimeUnix = function (time) {
        return moment(time).tz(this.timezone()).unix();
    };
    this.userLocalTimeMoment = function (time) {
        return moment(time).tz(this.timezone());
    };

    this.userLocalTimeFormat = function (unixTix, formaString) {
        var format = formaString ?
            formaString : 'ddd Do MMM YY';
        return moment(unixTix).tz(this.timezone()).format(format);
    }

    this.profilePictureUrl = function (size) {
        var email = this.emailAddresses() ?
                    this.emailAddresses()[0].emailAddress().toLowerCase() :
                    'this address does not exist. md5 collision unlikely';
        size = size || 50;
        if (this.profilePicture()) {
            return String(this.profilePicture().viewUrl());
        }
        return 'https://www.gravatar.com/avatar/' +
            md5(email) + '?d=mm&s=' + size;
    };

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

    this.primaryCompany = function () {
        var companies = this.userCompanies();
        return companies && companies[0] ?
          companies[0].company() : null;
    };

    this.primaryAddress = function () {
        var self = this;
        if (Boolean(self.addresses()) && Boolean(self.addresses()[0])) {
            return self.addresses()[0];
        }
        return null;
    };

    this.primaryAddressString = function () {
        var self = this;

        if (Boolean(self.primaryAddress())) {
            return self.primaryAddress().fullAddressString();
        }
        return 'Address not shared.';
     };

    this.findCompanyInUserCompanies = function (company) {
        var companies = this.userCompanies() ? this.userCompanies() : [],
            i;
        for (i = 0; i < companies.length; i++) {
            var c = companies[i].company();
            if (c.id() === company.id()) {
                return companies[i];
            }
        }
       return null;
    }

    this.isInCompany = function (company) {
        return Boolean(this.findCompanyInUserCompanies(company));
    }

    this.isCompanyAdmin = function (company) {
        return this.isInCompany(company) &&
            this.findCompanyInUserCompanies(company).isAdmin();
    }
}

export function Users() {
    this.resource = '/users';
    this.json = 'users';
    this.single = User;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
   };

    this.getRolesInDomain = function (success, error, domainId, roles,
                                      q, offset, limit, query, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result));
        }
        getList(self.resource, handleResponse, error,
            {offset: offset, limit: limit, q: q,
                inDomain: domainId, inDomainRoles: roles,
                embed: embed});
    };

}
