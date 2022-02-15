---
title: Domain Types
position: 4
parameters:
  - name:
    content:
content_markdown: |-
   Each domain is assigned a domainType. The domainType determines the type of products that can be made and sold by the domain. It can also determine which features are restricted or made available.

   | Type                | Value | Description                        |
   | ------------------- | ----- | ---------------------------------- |
   | UNRESTRICTED        | 0     | Can create all product types and has access to all features |
   | SELLER              | 1     | Freemium tier domain type can only create: SELLER_MOD and CHAINED_SELLER_MOD product types. This domain type is restricted from updating and customising themes, adding domain team members and selling products on the Merchi marketplace |
   | SELLER_PLUS         | 2     | Can create the following product types: SELLER, SELLER_MOD and CHAINED_SELLER_MOD. This domain type is restricted from selling products on the Merchi marketplace. |
   | SUPPLIER            | 3     | Can create all product types. This domain type can only sell products on the Merchi marketplace by invitation. |
   | RESTRICTED_SUPPLIER | 4     | Can create all product types. This domain type is restricted from selling products on the Merchi marketplace. |
   | DOMAIN_SUPPLIER     | 5     | Can not create any products. This domain type is created for third party suppliers to allow them to convert their production quotes into invoices and take payments. This domain type can be upgraded to a RESTRICTED_SUPPLIER on subscription. |


left_code_blocks:
  - code_block:
    title:
    language:
---