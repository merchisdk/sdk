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
     'product': job_product_embed}  # type: Dict[str, Any]

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
               'designer': {},
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
