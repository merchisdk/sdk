---
title: Filtering
position: 14
parameters:
  - name:
    content:
content_markdown: |-
    In addition to straight search, many more specific filtering parameters
    are available. For example the `in_domain` filter restricts list results
    to only those from a specific domain, and the `tags` filter restricts
    list results to only those with a specific Tag added. The exact list
    of supported filters varies by entity. For a complete list, see the
    [API reference](reference/index.html).

left_code_blocks:
  - code_block: |-
        import sdk.python.products
        query = {"tags": '["big", "blue"]'}
        products, _ = sdk.python.product.products.fetch(query=query)
        for product in products:
            print(product.name)
    title: filtering to big or blue products
    language: python
---
