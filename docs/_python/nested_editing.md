---
title: Nested editing
position: 11
parameters:
  - name:
    content:
content_markdown: |-
    Calling `update` on an entity will also automatically save any local
    changes to attached nested entities.

    In this example, we edit the name of a domain "through" the category object.

left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        from sdk.python.domains import Domain
        category = Category()
        category.id = 12  # assume that we already have the entities ids
        domain = Domain() 
        domain.id = 42
        category.domain = domain
        domain.domain = "new-store.example.com"  # newly chosen name
        category.update()
        print("Ok, the category and domain are both updated.")
    title: nested editing
    language: python
---
