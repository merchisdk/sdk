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


MARGIN_APPLIED_PRODUCT_TYPES = [
    SELLER_MOD,
    CLONED_SELLER_MOD,
    SUPPLIER_RESELL_MOD,
    CLONED_SUPPLIER_RESELL_MOD,
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
]

TYPE_STRINGS = dict(ALL_TYPES)
