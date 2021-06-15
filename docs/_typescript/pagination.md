---
title: Pagination
position: 14
parameters:
  - name:
    content:
content_markdown: |-
  As there may be tens or hundreds of thousands of some types of entities,
  `list` will not return them all at once, but rather it will return one
  "page" of results.

  The `limit` option controls how many results will be returned per page
  (further limited by backend-enforced limits, and how many entities are
  actually available. Defaults to 25 if not specified.

  The `offset` option controls how many entities to skip over. For example,
  if the limit is set to 10, setting offset to 20 will give you the third
  page. Defaults to zero not nto supplied.

  Additionally, the `ListMetadata` type is available on the response of
  a call to `list`, which contains information about how many entities where
  returned to this query, and how many are available in total (if the limit
  were infinite and the offset were zero).

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      merchi.Categories.list({offset: 10,
                              limit: 10).then((result) => {
        const categories = result.items;
        const info = result.metadata;
        console.log("Categories returned: " + info.count);
        console.assert(categories.length === info.count, "oh no!");
        console.log("Categories available: " + info.available);
      });
    title: pagination
    language: typescript
---
