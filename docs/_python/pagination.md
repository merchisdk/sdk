---
title: Pagination
position: 12
parameters:
  - name:
    content:
content_markdown: |-
    As there may be tens or hundreds of thousands of some types of entities,
    listing them will not return them all at once, but rather it will return
    one "page" of results.

    The `limit` option controls how many results will be returned per page
    (further limited by backend-enforced limits, and how many entities are
    actually available). It defaults to 25 if not specified.

    The `offset` option controls how many entities to skip over. For example,
    if the limit is set to 10, setting offset to 20 will give you the third
    page. It defaults to zero if not specified.

    Additionally the `PageSpecification` is available as the second return
    value from a listing call to `fetch`, which contains information about
    how many entities where returned to this query, and how many are available
    in total (if the limit where infinite and the offset where zero).

left_code_blocks:
  - code_block: |-
        import sdk.python.categories
        query = {"limit": 10,
                 "offset": 10}
        categories, info = sdk.python.categories.categories.fetch(query=query)
        print(f"Categories returned: {info.count}")
        assert len(categories) == info.count
        print(f"Categories available: {info.available}")
    title: pagination
    language: python
---
