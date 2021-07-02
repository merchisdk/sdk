---
title: Fetching a Single Entity
position: 5
parameters:
  - name:
    content:
content_markdown: |-
    Almost every entity in merchi is references by its id. Once you have the
    id of an object, you can fetch that entity specifically using the fetch
    static method.

    Note the differences from listing above. Listing uses the plural, snake_cased entity name and calls `fetch` with no arguments, where as fetching takes the CamelCased singular entity name and calls `fetch` on it with the `id` as its argument.
left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        category = Category.fetch(42)
        print(category)
    title: fetch a category
    language: python
---
