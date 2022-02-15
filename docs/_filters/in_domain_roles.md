---
title: inDomainRoles
position: 9
parameters:
  - name:
    content:
content_markdown: |-
   The `inDomainRoles` filter should be given a (JSON syntax) list of user
   role types (see the role enum in the entity reference for a list).

   It is only available on `User` entities, and only if either `inDomain` or
   `inDomainName` has also been specified, in which case the users in the
   result set are restricted to those which have at least one of the
   specified roles/permissions in the specified domain.
left_code_blocks:
  - code_block:
    title:
    language:
---
