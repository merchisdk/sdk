from typing import Any, Dict  # noqa # pylint: disable=unused-import


def dict_append(embed, new_dict):
    """ Extend an existing embed dictionary with new keys and key values """
    embed_copy = embed.copy()
    for key, value in new_dict.items():
        embed_copy[key] = value
    return embed_copy


comments_embed = \
    {'user': {'profilePicture': {}, "emailAddresses": {}},
     'file': {}}  # type: Dict[str, Any]

options_embed = {'options': {'linkedFile': {}}}  # type: Dict[str, Any]

# User and Company related resources
phone_email_embed = {'phoneNumbers': {},
                     'emailAddresses': {}}  # type: Dict[str, Any]
phone_email_and_address_embed = dict_append(phone_email_embed,
                                            {'addresses': {}})

user_companies_embed = {'user': {}}  # type: Dict[str, Any]

user_with_companies = \
    dict_append(phone_email_and_address_embed,
                {'userCompanies': {'company': {'addresses': {}},
                                   'user': {}}})

user_profile_embed = dict_append(user_with_companies, {"profilePicture": {}})

user_setting_embed = dict_append(user_profile_embed,
                                 {"enrolledDomains": {"domain": {}},
                                  "systemRoles": {}})

company_embed = {"emailAddresses": {},
                 "addresses": {},
                 "phoneNumbers": {},
                 "userCompanies": {'user': {'emailAddresses': {}}},
                 "banks": {"bankAddress": {}},
                 "paymentPhoneNumbers": {}} # type: Dict[str, Any]

domain_small_embed = \
    {'company': {'logo': {}, 'addresses': {},
                 'defaultTaxType': {}}}  # type: Dict[str, Any]

specifications_embed = \
    {'specificationField': options_embed,
     'specificationFiles': {}}  # type: Dict[str, Any]
specification_groups_embed = \
    {'specifications': specifications_embed}  # type: Dict[str, Any]

# Notification embed resources
recipient_embed = {'recipient': {}}  # type: Dict[str, Any]

notification_embed = {'sender': {'emailAddresses': {},
                                 'profilePicture': {}},
                      'relatedJob': {},
                      'attachment': {},
                      'domain': {'logo': {}}}  # type: Dict[str, Any]

html_notification_embed = {'sender': {'emailAddresses': {},
                                      'profilePicture': {}},
                           'relatedJob': {},
                           'attachment': {},
                           'htmlMessage': {},
                           'domain': {'logo': {}}}  # type: Dict[str, Any]

product_embed = \
    {'independentVariationFields':
         {'options': {'linkedFile': {}}},
     'groupVariationFields':
         {'options': {'linkedFile': {}}},
     'files': {}, 'discounts': {},
     'domain': {'company': {'defaultTaxType': {}}}} # type: Dict[str, Any]

job_small_notifications_embed = \
    {'domain': {'logo': {}},
     'relatedJob': {},
     'sender': {'profilePicture': {}},
     'recipient': {}}

# Shipment embed resources
shipment_embed = {'receiver': {},
                  'receiverCompany': {},
                  'receiverAddress': {},
                  'sender': {},
                  'senderCompany': {},
                  'senderAddress': {},
                  'jobs': {},
                  'assignments': {'job': {}, 'bid': {}}}  # type: Dict[str, Any]

# Invoice views embed resources
invoice_client_embed = dict_append(phone_email_and_address_embed,
                                   {'userCompanies': user_companies_embed})

invoice_job_embed = \
    {'product': {},
     'taxType': {},
     'client': {},
     'domain': domain_small_embed,
     'specifications': specifications_embed,
     'specificationsGroups': specification_groups_embed}  # type: Dict[str, Any]
invoice_item_embed = {'taxType': {}}  # type: Dict[str, Any]
invoice_embed = {'domain': domain_small_embed,
                 'responsibleManager': phone_email_embed,
                 'client': phone_email_and_address_embed,
                 'clientPhone': {},
                 'clientEmail': {},
                 'clientCompany': {},
                 'clientCompanyPhone': {},
                 'clientCompanyEmail': {},
                 'jobs': invoice_job_embed,
                 'items': invoice_item_embed,
                 'payments': {},
                 'pdf': {},
                 'receipt': {},
                 'shipping': {}}  # type: Dict[str, Any]

# Shipment views embed resources with assignments
production_shipment_embed = {'receiver': {},
                             'receiverCompany': {},
                             'receiverAddress': {},
                             'sender': {},
                             'senderCompany': {},
                             'senderAddress': {},
                             'assignments': {'job': {},
                                             'bid': {}}}  # type: Dict[str, Any]

# Job Production Views
assignment_embed = \
    {'job': {},
     'notifications': {'recipient': {}},
     'shipment': production_shipment_embed,
     'supplier': {'userCompanies': {'user': {},
                                    'company': {'addresses': {}}},
                  'emailAddresses': {},
                  'phoneNumbers': {},
                  'profilePicture': {},
                  'addresses': {},
                  'enrolledDomains': {'domain': {}}},
     'comments': comments_embed,
     'bid': {'bidItems': {}, 'assignments': {}}}  # type: Dict[str, Any]

# Job views embed resources
job_product_embed = \
    {'files': {},
     'domain': domain_small_embed,
     'groupVariationFields': options_embed,
     'independentVariationFields': options_embed}  # type: Dict[str, Any]

job_product_with_suppliers_embed = \
    dict_append(job_product_embed, {'suppliers': user_profile_embed})

job_list_embed = \
    {'domain': domain_small_embed,
     'client': invoice_client_embed,
     'product': job_product_embed,
     'invoice': {}}  # type: Dict[str, Any]

job_universal_embed = \
    {'domain': domain_small_embed,
     'client': phone_email_and_address_embed,
     'clientCompany': phone_email_and_address_embed,
     'manager': phone_email_and_address_embed,
     'specifications': specifications_embed,
     'specificationsGroups': specification_groups_embed,
     'product': job_product_embed,
     'taxType': {},
     'shipping': {}}  # type: Dict[str, Any]

job_info_embed = dict_append(job_universal_embed,
                             {'comments': comments_embed,
                              'designer': user_profile_embed,
                              'assignments': assignment_embed,
                              'drafts': {'file': {}, 'comments': {}},
                              'productionFiles': {},
                              'clientFiles': {},
                              'productionShippingAddress': {},
                              'product': job_product_with_suppliers_embed,
                              'notifications': recipient_embed})

draft_embed = {'file': {},
               'job': {'domain': {},
                       'drafts': {}},
               'designer': {'profilePicture': {}},
               'comments': comments_embed}

job_drafting_embed = \
    dict_append(job_universal_embed,
                {'drafts': draft_embed,
                 'shipping': {},
                 'productionFiles': {},
                 'clientFiles': {},
                 'designer': user_profile_embed,
                 'draftComments': comments_embed,
                 'notifications': recipient_embed})


job_invoice_view_embed = dict_append(job_universal_embed,
                                     {'invoice': invoice_embed,
                                      'notifications': recipient_embed})

job_shipment_embed = \
    dict_append(job_universal_embed,
                {'shipment': shipment_embed,
                 'assignments': {'job': {},
                                 'bid': {},
                                 'shipment': shipment_embed},
                 'shipping': {},
                 'notifications': recipient_embed})  # type: Dict[str, Any]

job_production_supplier_embed = \
    dict_append(job_universal_embed,
                {'assignments': assignment_embed,
                 'product': job_product_with_suppliers_embed,
                 'productionFiles': {},
                 'drafts': {'file': {}, 'comments': {}},
                 'comments': comments_embed,
                 'productionShippingAddress': {},
                 'notifications': recipient_embed})

job_production_embed = \
    dict_append(job_universal_embed,
                {'assignments': assignment_embed,
                 'product': job_product_with_suppliers_embed,
                 'productionFiles': {},
                 'drafts': {'file': {}, 'comments': {}},
                 'productionShippingAddress': {},
                 'notifications': recipient_embed})

job_notifications_embed = \
    dict_append(job_universal_embed,
                {'notifications': job_small_notifications_embed})

theme_edit_embed = \
    {'domain': {'logo': {}, 'company': {}},
     'mainCssTemplateEditing': {},
     'emailCssTemplateEditing': {},
     'mainCssTemplateUsing': {},
     'emailCssTemplateUsing': {},
     'indexPageTemplate': {},
     'invoicesPageTemplate': {},
     'productsPageTemplate': {},
     'domainInvitePageTemplate': {},
     'resetPasswordPageTemplate': {},
     'passwordChangePageTemplate': {},
     'smsLoginPageTemplate': {},
     'smsTokenPageTemplate': {},
     'jobsPageTemplate': {},
     'jobDraftingPageTemplate': {},
     'draftPreviewPageTemplate': {},
     'invoicePageTemplate': {},
     'userProfilePageTemplate': {},
     'companyProfilePageTemplate': {},
     'productPageTemplate': {},
     'invoicePaidPageTemplate': {},
     'headerTemplate': {},
     'footerTemplate': {},
     'mainCssFile': {}, 'emailCssFile': {},
     'cssImageFiles': {}, 'featureImage': {}}  # type: Dict[str, Any]

# Public embed starts here

def append_embed_for_public_domain(embed):
    menu = embed.setdefault('menus', {})
    menu.setdefault('menuItems', {})
    embed.setdefault('company', {})
    embed.setdefault('logo', {})
    embed.setdefault('themes', {'mainCssFile': {}})
    active = embed.setdefault('activeTheme', {})
    active.setdefault('headerCompiled', {})
    active.setdefault('footerCompiled', {})
    active.setdefault('mainCssFile', {})
    return embed

# Public company profile
public_company_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'companyProfilePageCompiled': {}}})
company_profile_public_embed = \
    {'domain_embed': public_company_domain_embed,
     'company_embed': company_embed}  # type: Dict[str, Any]

# Public draft
public_draft_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'jobDraftingPageCompiled': {}}})
client_job_drafting_embed = \
    {'domain_embed': public_draft_domain_embed,
     'job_embed': job_drafting_embed,
     'draft_embed': draft_embed}  # type: Dict[str, Any]

# Public draft file preview
public_draft_file_preview_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'draftPreviewPageCompiled': {}}})
draft_file_preview_embed = \
    {'domain_embed': public_draft_file_preview_domain_embed,
     'draft_embed': draft_embed}

# Public index
public_index_domain_embed = \
    append_embed_for_public_domain({'activeTheme': {'indexPageCompiled': {}}})
domain_index_embed = \
    {'domain_embed': public_index_domain_embed}  # type: Dict[str, Any]

# Public invite
public_domain_invite_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'domainInvitePageCompiled': {}}})
public_invite_embed = \
    {'user': {},
     'domain': public_domain_invite_domain_embed}  # type: Dict[str, Any]
public_domain_invite_embed = \
    {'domain_embed': public_domain_invite_domain_embed,
     'invite_embed': public_invite_embed}  # type: Dict[str, Any]

# Public invoice
public_invoice_domain_embed = \
    append_embed_for_public_domain(
        {'acjob_list_embedtiveTheme': {'invoicePageCompiled': {}},
         'company': {'addresses': {},
                     'phoneNumbers': {},
                     'emailAddresses': {},
                     'banks': {'bankAddress': {}}}})
public_invoice_embed = \
    {'shipping': {},
     'jobs': invoice_job_embed,
     'items': invoice_item_embed,
     'client': invoice_client_embed,
     'clientCompany': phone_email_embed,
     'clientCompanyPhone': {},
     'clientCompanyEmail': {},
     'clientEmail': {},
     'clientPhone': {},
     'pdf': {},
     'responsibleManager': {},
     'payments': {},
     'domain': public_invoice_domain_embed}  # type: Dict[str, Any]
client_invoice_embed = \
    {'domain_embed': public_invoice_domain_embed,
     'invoice_embed': public_invoice_embed}  # type: Dict[str, Any]

# Public invoice paid
invoice_paid_public_domain_embed = \
    append_embed_for_public_domain(
      {'company': {}, 'activeTheme': {'invoicePageCompiled': {}}})
invoice_paid_public_embed = \
    {'domain_embed': invoice_paid_public_domain_embed,
     'invoice_embed': public_invoice_embed}

# Public invoices
public_invoices_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'invoicesPageCompiled': {}}})
public_invoices_embed = {'jobs': invoice_job_embed,
                         'pdf': {}}  # type: Dict[str, Any]
client_invoices_embed = \
    {'domain_embed': public_invoices_domain_embed,
     'invoices_embed': public_invoices_embed}  # type: Dict[str, Any]

# Public jobs
client_jobs_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'jobsPageCompiled': {}}})
client_jobs_embed = \
    {'domain_embed': client_jobs_domain_embed,
     'jobs_embed': job_list_embed}  # type: Dict[str, Any]

# Public login
public_login_domain_embed = append_embed_for_public_domain({})
public_login_embed = \
    {'domain_embed': public_login_domain_embed}

# Public password change
public_password_change_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'passwordChangePageCompiled': {}}})
public_password_change_embed = \
    {'domain_embed': public_password_change_domain_embed}  # type: Dict[str, Any]

# Public passwod reset
public_reset_password_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'resetPasswordPageCompiled': {}}})
public_reset_password_embed = \
    {'domain_embed': public_reset_password_domain_embed}  # type: Dict[str, Any]

# Public product
public_product_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'productPageCompiled': {}}})
domain_product_public_embed = \
    {'domain_embed': public_product_domain_embed,
     'product_embed': product_embed}  # type: Dict[str, Any]

# Public products
public_products_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'productsPageCompiled': {}}})
domain_products_public_embed = \
    {'domain_embed': public_products_domain_embed,
     'products_embed': product_embed}  # type: Dict[str, Any]

# Public sms confirm
confirm_sms_token_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'smsTokenPageCompiled': {}}})
public_confirm_sms_token_embed = \
    {'domain_embed': confirm_sms_token_domain_embed}  # type: Dict[str, Any]

# Public sms login
public_sms_login_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'smsLoginPageCompiled': {}}})
public_sms_login_embed = \
    {'domain_embed': public_sms_login_domain_embed}  # type: Dict[str, Any]

# Public user profile
public_user_profile_domain_embed = \
    append_embed_for_public_domain(
        {'activeTheme': {'userProfilePageCompiled': {}}})
user_profile_public_embed = \
    {'domain_embed': public_user_profile_domain_embed,
     'user_embed': user_setting_embed}  # type: Dict[str, Any]

public_views_embed = \
    {'company_profile_public': company_profile_public_embed,
     'subdomain_company_profile_public': company_profile_public_embed,
     'client_job_drafting': client_job_drafting_embed,
     'subdomain_client_job_drafting': client_job_drafting_embed,
     'draft_file_preview': draft_file_preview_embed,
     'subdomain_draft_file_preview': draft_file_preview_embed,
     'domain_index': domain_index_embed,
     'subdomain_domain_index': domain_index_embed,
     'public_domain_invite': public_domain_invite_embed,
     'subdomain_public_domain_invite': public_domain_invite_embed,
     'client_invoice': client_invoice_embed,
     'subdomain_client_invoice': client_invoice_embed,
     'client_invoices': client_invoices_embed,
     'subdomain_client_invoices': client_invoices_embed,
     'invoice_paid_public': invoice_paid_public_embed,
     'subdomain_invoice_paid_public': invoice_paid_public_embed,
     'client_jobs': client_jobs_embed,
     'subdomain_client_jobs': client_jobs_embed,
     'public_login': public_login_embed,
     'subdomain_public_login': public_login_embed,
     'public_password_change': public_password_change_embed,
     'subdomain_public_password_change': public_password_change_embed,
     'public_reset_password': public_reset_password_embed,
     'subdomain_public_reset_password': public_reset_password_embed,
     'domain_product_public': domain_product_public_embed,
     'subdomain_domain_product_public': domain_product_public_embed,
     'domain_products_public': domain_products_public_embed,
     'subdomain_domain_products_public': domain_products_public_embed,
     'public_confirm_sms_token': public_confirm_sms_token_embed,
     'subdomain_public_confirm_sms_token': public_confirm_sms_token_embed,
     'public_sms_login': public_sms_login_embed,
     'subdomain_public_sms_login': public_sms_login_embed,
     'user_profile_public': user_profile_public_embed,
     'subdomain_user_profile_public': user_profile_public_embed}  # type: Dict[str, Any]
