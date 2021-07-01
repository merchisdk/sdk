---
title: Creating Nested Entities
position: 9
parameters:
  - name:
    content:
content_markdown: |-
    Entities can have relationships to other entities.

    For example, categories are always linked to a domain, which is the merchi name for a store.

    When creating an entity you can attach a merchi `Domain` object to the
    category object, on order to specify which domain it should be attached to.
left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        from sdk.python.domains import Domain
        new_category = Category()
        existing_domain = Domain()
        existing_domain.id = 42  # note: this id already exists
        new_category.domain = existing_domain
        new_category.name = "vegetables"
        new_category.create()
        print("Ok, new vegetables category created on domain 42")
    title: create a category with a domain
    language: python
---
