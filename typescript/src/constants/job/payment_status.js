export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["INIT"] = 0] = "INIT";
    PaymentStatus[PaymentStatus["ISSUED"] = 1] = "ISSUED";
    PaymentStatus[PaymentStatus["OVERDUE"] = 2] = "OVERDUE";
    PaymentStatus[PaymentStatus["PARTIAL_PAID"] = 3] = "PARTIAL_PAID";
    PaymentStatus[PaymentStatus["FULLY_PAID"] = 4] = "FULLY_PAID";
})(PaymentStatus || (PaymentStatus = {}));
