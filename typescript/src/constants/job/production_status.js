export var ProductionStatus;
(function (ProductionStatus) {
    ProductionStatus[ProductionStatus["INIT"] = 0] = "INIT";
    ProductionStatus[ProductionStatus["REJECTED"] = 1] = "REJECTED";
    ProductionStatus[ProductionStatus["BIDDING"] = 2] = "BIDDING";
    ProductionStatus[ProductionStatus["ASSIGN_SENT"] = 3] = "ASSIGN_SENT";
    ProductionStatus[ProductionStatus["ASSIGN_DEADLINE_REACHED"] = 5] = "ASSIGN_DEADLINE_REACHED";
    ProductionStatus[ProductionStatus["QUESTIONING"] = 6] = "QUESTIONING";
    ProductionStatus[ProductionStatus["COMMENCED"] = 7] = "COMMENCED";
    ProductionStatus[ProductionStatus["FINISHED"] = 8] = "FINISHED";
    ProductionStatus[ProductionStatus["SHIPPED"] = 9] = "SHIPPED";
})(ProductionStatus || (ProductionStatus = {}));
