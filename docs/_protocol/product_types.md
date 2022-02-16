---
title: Product Types
position: 6
parameters:
  - name:
    content:
content_markdown: |-
   Each product is assigned a productType. The productType determines which features are made available to it's users.
   The product types fall under 3 main categories: supplier, seller and system.
   Supplier product types are in most cases used for "B to B", can create new
     value chains (chained products) and are typically customisable. Seller product types are in most cases "B to C" and do not require customisation. System product types can not be assigned by users but are auto assigned by the API, they are used by the API to assist with chaining and automation.



   | Type                | Value | User     | Description                 |
   | ------------------- | ----- | -------- | --------------------------- |
   | SUPPLIER_MOD        | 0     | supplier | Used by suppliers to create a customisable MOD (made on demand) product profile. Sellers can select and customise this product to create their own "SELLER_MOD" product profile, which they can then sell on their store. |
   | SUPPLIER            | 1     | supplier | Used by suppliers to create a customisable product profile. Sellers can select and customise this product to create their own chained product profile, which they can then sell on their store. |
   | SELLER              | 2     | seller   |  |
   | SELLER_MOD          | 3     | seller   |  |
   | CHAINED_MOD         | 4     | api      |  |
   | CHAINED_SELLER_MOD  | 5     | api      |  |
   | PRODUCTION_MOD      | 6     | api      |  |
   | CHAINED_SUPPLIER    | 7     | api      |  |
   | INVENTORY_SELLER    | 8     | api      |  |
   | INVENTORY_SUPPLIER  | 9     | api      |  |


left_code_blocks:
  - code_block:
    title:
    language:
---
