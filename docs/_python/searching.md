---
title: Searching
position: 13
parameters:
  - name:
    content:
content_markdown: |-
    Most entities also accept a `q` parameter for searching or filtering by
    keywords.

    The following example shows how to find products related to eggs (the
    product might have the word egg in it's name, or description, or might be
    in a category named egg, or so on).

left_code_blocks:
  - code_block: |-
        import sdk.python.categories
        query = {"q": "egg"}
        categories, _ = sdk.python.categories.categories.fetch(query=query)
        for category in categories:
            print(category.name)
    title: searching
    language: python
---
