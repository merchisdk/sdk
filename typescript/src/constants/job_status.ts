export enum DraftingStatus {
  INIT = 0,
  WAIT_DRAFTING = 1,
  CHANGES_REQUESTED = 2,
  DRAFTING_UPLOADED = 3,
  DRAFTING_APPROVED = 4,
}

export enum PaymentStatus {
  INIT = 0,
  ISSUED = 1,
  OVERDUE = 2,
  PARTIAL_PAID = 3,
  FULLY_PAID = 4,
}

export enum ProductionStatus {
  INIT = 0,
  REJECTED = 1,
  QUOTING = 2,
  ASSIGN_SENT = 3,
  ASSIGN_DEADLINE_REACHED = 4,
  ASSIGN_COMPLETE = 5,
  QUESTIONING = 6,
  COMMENCED = 7,
  FINISHED = 8,
  SHIPPED = 9,
  COMPLETED = 10,
}

export enum ShipmentStatus {
  NOT_ASSIGNED = 0,
  ASSIGNED = 1,
  DISPATCH_SET = 2,
  DISPATCH_WARNING = 3,
  DISPATCH_LATE = 4,
  DISPATCHED = 5,
  EXPECTED_RECEIVE_DATE_WARNING = 6,
  EXPECTED_RECEIVE_DATE_PAST = 7,
  RECEIVED = 8,
  PICKED_UP = 9,
}

export enum SupplyChainRequestStatus {
  NO_REQUEST = 0,
  REQUESTED = 1,
  DECLINED = 2,
  ACCEPTED = 3,
}
