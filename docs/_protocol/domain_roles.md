---
title: Domain Roles
position: 3
parameters:
  - name:
    content:
content_markdown: |-
   Each domain user is assigned a domainRole. The domainRole determines which permissions the user has on the domain and it's associated entities.

   | Type                | Value | Description                        |
   | ------------------- | ----- | ---------------------------------- |
   | PUBLIC              | 0     | publice has no permissions on the domain. |
   | ADMIN               | 1     | admin has all permissions on the domain and it's associated entities. |
   | SALES               | 2     | sales has limited permissions on the domain and can add/edit/delete jobs, invoices, products, users and shipments. |
   | DESIGNER            | 3     | designer can only edit and update job specific attributes related to job drafting and some specific job production attributes. |
   | SUPPLIER            | 4     | supplier can only edit and update job assignments which they've been specifically assigned to. |
   | CLIENT              | 5     | client can access and edit (some) job attributes where they are the assigned client or in the assigned client company. |
   | MANAGER             | 6     | manager has limited permissions on the domain and can add/edit/delete jobs, invoices, products, users and shipments. |
   | ACCOUNTANT          | 7     | accountant can access invoices, jobs and shipments. |
   | THEME_EDITOR        | 8     | theme editor can create themems, edit them and apply them to the domain. |


left_code_blocks:
  - code_block:
    title:
    language:
---