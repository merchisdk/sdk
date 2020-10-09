export var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus[InventoryStatus["DEDUCTED"] = 0] = "DEDUCTED";
    InventoryStatus[InventoryStatus["CAN_DEDUCT"] = 1] = "CAN_DEDUCT";
    InventoryStatus[InventoryStatus["NOT_SUFFICIENT"] = 2] = "NOT_SUFFICIENT";
    InventoryStatus[InventoryStatus["NO_MATCHING_INVENTORY"] = 3] = "NO_MATCHING_INVENTORY";
})(InventoryStatus || (InventoryStatus = {}));
