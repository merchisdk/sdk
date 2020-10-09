export var DraftingStatus;
(function (DraftingStatus) {
    DraftingStatus[DraftingStatus["INIT"] = 0] = "INIT";
    DraftingStatus[DraftingStatus["WAIT_DRAFTING"] = 1] = "WAIT_DRAFTING";
    DraftingStatus[DraftingStatus["CHANGES_REQUESTED"] = 2] = "CHANGES_REQUESTED";
    DraftingStatus[DraftingStatus["DRAFTING_UPLOADED"] = 3] = "DRAFTING_UPLOADED";
    DraftingStatus[DraftingStatus["DRAFTINGA_APPROVED"] = 4] = "DRAFTINGA_APPROVED";
})(DraftingStatus || (DraftingStatus = {}));
