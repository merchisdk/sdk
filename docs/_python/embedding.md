---
title: Embedding
position: 10
parameters:
  - name:
    content:
content_markdown: |-
    Because entities can be nested arbitrarily deeply `fetch` does not, by
    default, fetch nested entities from the server. Only scalar properties
    (strings, numbers, dates, ...) are included.

    It is possible however to request that the server also include specific
    nested entities using the embed parameter, as in the following example.

    On a newly fetched (or locally created) `Category`, `category.domain` will
    be `None`, even if the category has a domain on the server. You must
    request that the domain be embedded in order to know whether the value
    is truly null, or just locally unavailable.
    {: .warning }

    The following example shows using embed only with fetching a single entity,
    but you can also supply the embed parameter when listing multiple entities.
    {: .success }

left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        embed = {'domain': {'theme': {}}}
        category = Category.fetch(42, embed=embed)
        theme_id = category.domain.theme.id
        print(f"The id of the theme of the domain of category 42 is: {theme_id}")
    title: embed
    language: python
---
