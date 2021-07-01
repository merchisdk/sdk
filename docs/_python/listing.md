---
title: Listing Entities
position: 4
parameters:
  - name:
    content:
content_markdown: |-
    Merchi breaks up entities into different types, which loosely corrospond
    to REST resources. For each type, there is normally many specific entities
    available. For example, here is how to get an array of product categories
    from the server:
left_code_blocks:
  - code_block: |-
        import sdk.python.categories
        categories, _ = sdk.python.categories.categories.fetch()
        print(categories)
    title: list categories
    language: python
---
