---
title: relatedUser
position: 28
parameters:
  - name:
    content:
content_markdown: |-
   The `relatedUser` filter should be given an integer representing a `User` id.

   It restricts the result set to only those entities which are related
   specified `User`. The meaning of "related" is worked out in some sensible
   way for each type of entity. For example, a `User` might be related to
   a `Job` if they where either the manager, designer, or supplier for it.

   It is available on the `File`, `EnrolledDomain`, `Category`, `Product`,
   `Job`, and `Company` entities.
left_code_blocks:
  - code_block:
    title:
    language:
---
