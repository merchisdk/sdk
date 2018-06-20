from typing import Dict, Any  # noqa #pylint: disable=unused-import


def append_embed_for_domain(embed):
    menu = embed.setdefault("menus", {})
    menu.setdefault("menuItems", {})
    embed.setdefault("logo", {})
    embed.setdefault("themes", {"mainCssFile": {}})
    active = embed.setdefault("activeTheme", {})
    active.setdefault("headerCompiled", {})
    active.setdefault("footerCompiled", {})
    active.setdefault("mainCssFile", {})
    return embed


PUBLIC_DOMAIN_INVITE_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme':
                             {'domainInvitePageCompiled': {}}})

CLIENT_JOBS_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {'jobsPageCompiled': {}}})

CLIENT_JOB_DRAFTING_JOB_EMBED = {
    "specificationsGroups":
        {"specifications": {"specificationField": {"options": {}},
                            "specificationFiles": {}}},
    "specifications": {"specificationField": {"options": {}},
                       "specificationFiles": {}},
    "productionFiles": {},
    "taxType": {},
    "drafts": {"comments": {"file": {},
                            "user": {"emailAddresses": {},
                                     "profilePicture": {}}},
               "designer": {"profilePicture": {}},
               "job": {"drafts": {}, "domain": {}},
               "file": {}},
    "clientFiles": {},
    "draftComments": {"user": {"emailAddresses": {},
                               "profilePicture": {}},
                      "file": {},
                      "draft": {}},
    "domain": {'logo': {}, 'company': {}},
    "client": {"addresses": {},
               "emailAddresses": {},
               "phoneNumbers": {}},
    "shipping": {},
    "product": {"files": {},
                "domain": {"company": {}},
                "independentVariationFields":
                    {"options": {"linkedFile": {}}},
                "groupVariationFields":
                    {"options": {"linkedFile": {}}}}}

CLIENT_JOB_DRAFTING_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {'jobDraftingPageCompiled': {}},
                             'company': {}})

DRAFT_FILE_PREVIEW_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {'draftPreviewPageCompiled': {}},
                             'company': {}})

DRAFT_FILE_PREVIEW_JOB_EMBED = {'domain': {}}  # type: Dict[Any, Any]

CLIENT_INVOICES_DOMAIN_EMBED = \
    append_embed_for_domain({"activeTheme": {"invoicesPageCompiled": {}}})

CLIENT_INVOICE_DOMAIN_EMBED = \
    append_embed_for_domain({"logo": {},
                             'themes': {'mainCssFile': {}},
                             "menus": {"menuItems": {}},
                             'activeTheme': {'invoicePageCompiled': {}},
                             "company": {"addresses": {},
                                         "phoneNumbers": {},
                                         "emailAddresses": {},
                                         "banks": {"bankAddress": {}}}})

USER_PROFILE_PUBLIC_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {'userProfilePageCompiled': {}}})

COMPANY_PROFILE_PUBLIC_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {'companyProfilePageCompiled': {}}})

DOMAIN_PRODUCTS_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {"productsPageCompiled": {}}})

DOMAIN_INDEX_DOMAIN_EMBED = \
    append_embed_for_domain({"activeTheme": {"indexPageCompiled": {}}})

DOMAIN_PRODUCT_DOMAIN_EMBED = \
    append_embed_for_domain({'activeTheme': {'productPageCompiled': {}}})

USER_PATCH_PUBLIC_DOMAIN_EMBED = append_embed_for_domain({})

INVOICE_PAID_PUBLIC_DOMAIN_EMBED = \
    append_embed_for_domain({'company': {},
                             'activeTheme': {'invoicePageCompiled': {}}})
