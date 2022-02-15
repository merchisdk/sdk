---
title: state
position: 4
parameters:
  - name:
    content:
content_markdown: |-
   The `state` filter should be given a string representing the state name.

   It restricts the result set to entities which are in a specific state.
   The exact meaning depends on the entity being listed.

   The following states are available on the `Quote` entity:

      - canAddToInvoice

   The following states are available on the `Assignment` entity:

      - assignmentsNeedShipping
      - assignmentsAll (does nothing)

   The following states are available on the `Job` entity:

      - jobsActive
      - jobsAll (does nothing)
      - jobsAllActive
      - jobsAllActiveDrafting
      - jobsArchived
      - jobsCompleted
      - jobsUnpaid
      - jobsAllWithoutInvoices
      - jobsUnassignedProduction
      - jobsNeedShipping
      - jobsAllShipments
      - jobsShipments
      - jobsDraftingActiveDesigner
      - jobsDraftingUnassignedDesigner
      - jobsDraftingDraftsWaitingDesigner
      - jobsDraftingDraftsChangesRequestedDesigner
      - jobsProductionAllActiveSupplier
      - jobsProductionShipmentReady
      - jobsProductionShipmentDispatched
      - jobsProductionQuotingSupplier
      - jobsProductionCompleteSupplier
      - jobsActiveProductionSupplier
      - jobsProductionShipmentsSupplier
      - jobsProductionQuoteSuccessfulSupplier

   The following states are available on the `Shipment` entity:

      - notInvoiced
      - notQuoted
      - notQuotedOrInvoice

left_code_blocks:
  - code_block:
    title:
    language:
---
