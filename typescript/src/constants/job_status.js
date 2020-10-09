export var DraftingStatus;
(function (DraftingStatus) {
    DraftingStatus[DraftingStatus["INIT"] = 0] = "INIT";
    DraftingStatus[DraftingStatus["WAIT_DRAFTING"] = 1] = "WAIT_DRAFTING";
    DraftingStatus[DraftingStatus["CHANGES_REQUESTED"] = 2] = "CHANGES_REQUESTED";
    DraftingStatus[DraftingStatus["DRAFTING_UPLOADED"] = 3] = "DRAFTING_UPLOADED";
    DraftingStatus[DraftingStatus["DRAFTING_APPROVED"] = 4] = "DRAFTING_APPROVED";
})(DraftingStatus || (DraftingStatus = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["INIT"] = 0] = "INIT";
    PaymentStatus[PaymentStatus["ISSUED"] = 1] = "ISSUED";
    PaymentStatus[PaymentStatus["OVERDUE"] = 2] = "OVERDUE";
    PaymentStatus[PaymentStatus["PARTIAL_PAID"] = 3] = "PARTIAL_PAID";
    PaymentStatus[PaymentStatus["FULLY_PAID"] = 4] = "FULLY_PAID";
})(PaymentStatus || (PaymentStatus = {}));
export var ProductionStatus;
(function (ProductionStatus) {
    ProductionStatus[ProductionStatus["INIT"] = 0] = "INIT";
    ProductionStatus[ProductionStatus["REJECTED"] = 1] = "REJECTED";
    ProductionStatus[ProductionStatus["BIDDING"] = 2] = "BIDDING";
    ProductionStatus[ProductionStatus["ASSIGN_SENT"] = 3] = "ASSIGN_SENT";
    ProductionStatus[ProductionStatus["ASSIGN_DEADLINE_REACHED"] = 4] = "ASSIGN_DEADLINE_REACHED";
    ProductionStatus[ProductionStatus["ASSIGN_COMPLETE"] = 5] = "ASSIGN_COMPLETE";
    ProductionStatus[ProductionStatus["QUESTIONING"] = 6] = "QUESTIONING";
    ProductionStatus[ProductionStatus["COMMENCED"] = 7] = "COMMENCED";
    ProductionStatus[ProductionStatus["FINISHED"] = 8] = "FINISHED";
    ProductionStatus[ProductionStatus["SHIPPED"] = 9] = "SHIPPED";
})(ProductionStatus || (ProductionStatus = {}));
export var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus[ShipmentStatus["NOT_ASSIGNED"] = 0] = "NOT_ASSIGNED";
    ShipmentStatus[ShipmentStatus["ASSIGNED"] = 1] = "ASSIGNED";
    ShipmentStatus[ShipmentStatus["DISPATCH_SET"] = 2] = "DISPATCH_SET";
    ShipmentStatus[ShipmentStatus["DISPATCH_WARNING"] = 3] = "DISPATCH_WARNING";
    ShipmentStatus[ShipmentStatus["DISPATCH_LATE"] = 4] = "DISPATCH_LATE";
    ShipmentStatus[ShipmentStatus["DISPATCHED"] = 5] = "DISPATCHED";
    ShipmentStatus[ShipmentStatus["EXPECTED_RECEIVE_DATE_WARNING"] = 6] = "EXPECTED_RECEIVE_DATE_WARNING";
    ShipmentStatus[ShipmentStatus["EXPECTED_RECEIVE_DATE_PAST"] = 7] = "EXPECTED_RECEIVE_DATE_PAST";
    ShipmentStatus[ShipmentStatus["REEIVED"] = 8] = "REEIVED";
})(ShipmentStatus || (ShipmentStatus = {}));
