import { generateUUID } from './uuid';
import { addPropertyTo, serialise, create, fromJson, enumerateFiles, getOne,
    patchOne, fromJsonList, getList } from './model'
import { themeStatus } from './theme_status';
import { MerchiFile } from './merchi_file';
import { Domain } from './domain';
import { Page } from './page';
import { User } from './user';

export function Theme() {
    this.resource = '/themes';
    this.json = 'theme';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'foundation');
    addPropertyTo(this, 'public');
    addPropertyTo(this, 'lastUpdated');

    addPropertyTo(this, 'featureImage', MerchiFile);
    addPropertyTo(this, 'images', MerchiFile);
    addPropertyTo(this, 'cssImageFiles', MerchiFile);
    addPropertyTo(this, 'pages', Page);

    addPropertyTo(this, 'headerTemplate');
    addPropertyTo(this, 'headerHtml');
    addPropertyTo(this, 'headerJs');
    addPropertyTo(this, 'footerTemplate');
    addPropertyTo(this, 'footerHtml');
    addPropertyTo(this, 'footerJs');
    addPropertyTo(this, 'indexPageTemplate');
    addPropertyTo(this, 'indexHtml');
    addPropertyTo(this, 'indexJs');
    addPropertyTo(this, 'invoicesPageTemplate');
    addPropertyTo(this, 'invoicesHtml');
    addPropertyTo(this, 'invoicesJs');
    addPropertyTo(this, 'productsPageTemplate');
    addPropertyTo(this, 'productsHtml');
    addPropertyTo(this, 'productsJs');
    addPropertyTo(this, 'domainInvitePageTemplate');
    addPropertyTo(this, 'domainInviteHtml');
    addPropertyTo(this, 'domainInviteJs');
    addPropertyTo(this, 'resetPasswordPageTemplate');
    addPropertyTo(this, 'passwordResetHtml');
    addPropertyTo(this, 'passwordResetJs');
    addPropertyTo(this, 'passwordChangePageTemplate');
    addPropertyTo(this, 'passwordChangeHtml');
    addPropertyTo(this, 'passwordChangeJs');
    addPropertyTo(this, 'jobsPageTemplate');
    addPropertyTo(this, 'jobsHtml');
    addPropertyTo(this, 'jobsJs');
    addPropertyTo(this, 'jobDraftingPageTemplate');
    addPropertyTo(this, 'jobDraftingHtml');
    addPropertyTo(this, 'jobDraftingJs');
    addPropertyTo(this, 'jobQuoteRequestedPageTemplate');
    addPropertyTo(this, 'jobQuoteRequestedHtml');
    addPropertyTo(this, 'jobQuoteRequestedJs');
    addPropertyTo(this, 'draftPreviewPageTemplate');
    addPropertyTo(this, 'draftPreviewHtml');
    addPropertyTo(this, 'draftPreviewJs');
    addPropertyTo(this, 'invoicePageTemplate');
    addPropertyTo(this, 'invoiceHtml');
    addPropertyTo(this, 'invoiceJs');
    addPropertyTo(this, 'userProfilePageTemplate');
    addPropertyTo(this, 'userProfileHtml');
    addPropertyTo(this, 'userProfileJs');
    addPropertyTo(this, 'companyProfilePageTemplate');
    addPropertyTo(this, 'companyProfileHtml');
    addPropertyTo(this, 'companyProfileJs');
    addPropertyTo(this, 'productPageTemplate');
    addPropertyTo(this, 'productHtml');
    addPropertyTo(this, 'productJs');
    addPropertyTo(this, 'invoicePaidPageTemplate');
    addPropertyTo(this, 'invoicePaidHtml');
    addPropertyTo(this, 'invoicePaidJs');
    addPropertyTo(this, 'loginPageTemplate');
    addPropertyTo(this, 'loginPageHtml');
    addPropertyTo(this, 'loginPageJs');
    addPropertyTo(this, 'errorPageTemplate');
    addPropertyTo(this, 'errorPageHtml');
    addPropertyTo(this, 'errorPageJs');

    addPropertyTo(this, 'footerError');
    addPropertyTo(this, 'headerError');
    addPropertyTo(this, 'indexPageError');
    addPropertyTo(this, 'invoicesPageError');
    addPropertyTo(this, 'productsPageError');
    addPropertyTo(this, 'domainInvitePageError');
    addPropertyTo(this, 'resetPasswordPageError');
    addPropertyTo(this, 'passwordChangePageError');
    addPropertyTo(this, 'jobsPageError');
    addPropertyTo(this, 'jobDraftingPageError');
    addPropertyTo(this, 'jobQuoteRequestedPageError');
    addPropertyTo(this, 'draftPreviewPageError');
    addPropertyTo(this, 'invoicePageError');
    addPropertyTo(this, 'userProfilePageError');
    addPropertyTo(this, 'companyProfilePageError');
    addPropertyTo(this, 'productPageError');
    addPropertyTo(this, 'invoicePaidPageError');
    addPropertyTo(this, 'loginPageError');
    addPropertyTo(this, 'errorPageError');

    addPropertyTo(this, 'mainCssErrorMessage');
    addPropertyTo(this, 'mainCssStatus');
    addPropertyTo(this, 'mainCss');
    addPropertyTo(this, 'mainCssTemplateEditing');
    addPropertyTo(this, 'mainCssTemplateUsing');

    addPropertyTo(this, 'emailCssErrorMessage');
    addPropertyTo(this, 'emailCssStatus');
    addPropertyTo(this, 'emailCss');
    addPropertyTo(this, 'emailCssTemplateEditing');
    addPropertyTo(this, 'emailCssTemplateUsing');

    addPropertyTo(this, 'author', User);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'defaultForDomainType');

    this.create = function (success, error, embed, as_domain) {
        var self = this,
            data = serialise(this);
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
            data = serialise(this)[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.canBeActivated = function () {
        var validStatus = themeStatus.get("VALID_BUT_NOT_UPDATED");
        return this.mainCssStatus() >= validStatus &&
            this.emailCssStatus() >= validStatus;
    };

    this.isActiveOnDomain = function (domainId) {
        var domain = this.domain();
        return domain && domain.id() === parseInt(domainId, 10) &&
            domain.activeThemeId() === this.id();
    };

    this.getPageBySlug = function (slug) {
        var pages = this.pages() ? this.pages() : [],
            i;
        for (i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (page.slug() === slug) {
                return page;
             }
        }
         return null;
     };

    this.updateTemplateByName = function (name, text) {
        var page = this.getPageBySlug(name);
        if (page) {
            page.template(text);
        } else {
            this[name](text);
        }
    };
}

export function Themes() {
    this.resource = '/themes';
    this.json = 'themes';
    this.single = Theme;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };

}
