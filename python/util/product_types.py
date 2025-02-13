import sdk.python.util.job_types as job

SUPPLIER_MOD = 0
SUPPLIER = 1
SELLER = 2
SELLER_MOD = 3
CLONED_SUPPLIER_MOD = 4
CLONED_SELLER_MOD = 5
PRODUCTION_MOD = 6
CLONED_SUPPLIER = 7
INVENTORY_SELLER = 8
INVENTORY_SUPPLIER = 9
SELLER_GROUP_BUY = 10
SUPPLIER_RESELL_MOD = 11
SUPPLIER_RESELL = 12
SUPPLIER_GROUP_BUY_INVENTORY = 13
CLONED_INVENTORY_SELLER = 14
CLONED_SELLER_GROUP_BUY_INVENTORY = 15
CLONED_SUPPLIER_RESELL_MOD = 16
SUPPLIER_TO_SUPPLIER_RESELL_MOD = 17
CLONED_SUPPLIER_RESELL = 18
SUPPLY_DOMAIN_REFERENCE = 19
SELLER_FILE_DOWNLOAD = 20
SUPPLIER_MOD_SUPPLY_CHAIN_REQUEST = 21
SUPPLIER_SUPPLY_CHAIN_REQUEST = 22
LEAD_FORM = 23


PRODUCT_TYPE_CORRESPONDING_JOB_TYPE = {
    SUPPLIER_MOD: job.PRODUCT_CREATION_MOD,
    SUPPLIER: job.PRODUCT_CREATION,
    SELLER: job.SELLER,
    SELLER_MOD: job.SELLER_MOD,
    CLONED_SUPPLIER_MOD: job.PRODUCT_CREATION_MOD,
    CLONED_SELLER_MOD: job.SELLER_MOD,
    PRODUCTION_MOD: job.SUPPLIER_FULFILLMENT,
    CLONED_SUPPLIER: job.PRODUCT_CREATION,
    INVENTORY_SELLER: job.SELLER,
    INVENTORY_SUPPLIER: job.SUPPLIER_FULFILLMENT_INVENTORY,
    SELLER_GROUP_BUY: job.SELLER_GROUP_BUY,
    SUPPLIER_RESELL_MOD: job.PRODUCT_RESELL_CREATION_MOD,
    SUPPLIER_RESELL: job.PRODUCT_RESELL_CREATION,
    SUPPLIER_GROUP_BUY_INVENTORY:
        job.SUPPLIER_FULFILLMENT_INVENTORY_GROUP_BUY,
    CLONED_INVENTORY_SELLER: job.SELLER,
    CLONED_SELLER_GROUP_BUY_INVENTORY:
        job.SELLER_GROUP_BUY,
    CLONED_SUPPLIER_RESELL_MOD:
        job.PRODUCT_RESELL_CREATION_MOD,
    SUPPLIER_TO_SUPPLIER_RESELL_MOD:
        job.SUPPLIER_FULFILLMENT_RESELL,
    CLONED_SUPPLIER_RESELL:
        job.PRODUCT_RESELL_CREATION_MOD,
    SUPPLY_DOMAIN_REFERENCE: job.SUPPLIER_FULFILLMENT,
    SELLER_FILE_DOWNLOAD: job.SELLER_FILE_DOWNLOAD,
    SUPPLIER_MOD_SUPPLY_CHAIN_REQUEST:
        job.SUPPLY_CHAIN_CREATION,
    SUPPLIER_SUPPLY_CHAIN_REQUEST:
        job.SUPPLY_CHAIN_CREATION,
    LEAD_FORM: job.LEAD
}

MOD_PRODUCT_TYPES = [
    SELLER_MOD,
    CLONED_SELLER_MOD,
    SUPPLIER_RESELL_MOD,
    CLONED_SUPPLIER_RESELL_MOD,
]

MARGIN_APPLIED_PRODUCT_TYPES = [
    *MOD_PRODUCT_TYPES,
    SUPPLIER_RESELL,
    CLONED_SUPPLIER_RESELL,
]


ALL_TYPES = [
    (SUPPLIER_MOD, "SUPPLIER_MOD"),
    (SUPPLIER, "SUPPLIER"),
    (SELLER, "SELLER"),
    (SELLER_MOD, "SELLER_MOD"),
    (CLONED_SUPPLIER_MOD, "CLONED_SUPPLIER_MOD"),
    (CLONED_SELLER_MOD, "CLONED_SELLER_MOD"),
    (PRODUCTION_MOD, "PRODUCTION_MOD"),
    (CLONED_SUPPLIER, "CLONED_SUPPLIER"),
    (INVENTORY_SELLER, "INVENTORY_SELLER"),
    (INVENTORY_SUPPLIER, "INVENTORY_SUPPLIER"),
    (SELLER_GROUP_BUY, "SELLER_GROUP_BUY"),
    (SUPPLIER_RESELL_MOD, "SUPPLIER_RESELL_MOD"),
    (SUPPLIER_RESELL, "SUPPLIER_RESELL"),
    (SUPPLIER_GROUP_BUY_INVENTORY, "SUPPLIER_GROUP_BUY_INVENTORY"),
    (CLONED_INVENTORY_SELLER, "CLONED_INVENTORY_SELLER"),
    (CLONED_SELLER_GROUP_BUY_INVENTORY, "CLONED_SELLER_GROUP_BUY_INVENTORY"),
    (CLONED_SUPPLIER_RESELL_MOD, "CLONED_SUPPLIER_RESELL_MOD"),
    (SUPPLIER_TO_SUPPLIER_RESELL_MOD, "SUPPLIER_TO_SUPPLIER_RESELL_MOD"),
    (CLONED_SUPPLIER_RESELL, "CLONED_SUPPLIER_RESELL"),
    (SUPPLY_DOMAIN_REFERENCE, "SUPPLY_DOMAIN_REFERENCE"),
    (SELLER_FILE_DOWNLOAD, "SELLER_FILE_DOWNLOAD"),
    (SUPPLIER_MOD_SUPPLY_CHAIN_REQUEST,
        "SUPPLIER_MOD_SUPPLY_CHAIN_REQUEST"),
    (SUPPLIER_SUPPLY_CHAIN_REQUEST,
        "SUPPLIER_SUPPLY_CHAIN_REQUEST"),
    (LEAD_FORM, "LEAD_FORM")
]

TYPE_STRINGS = dict(ALL_TYPES)
