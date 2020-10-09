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
    ShipmentStatus[ShipmentStatus["RECEIVED"] = 8] = "RECEIVED";
})(ShipmentStatus || (ShipmentStatus = {}));
