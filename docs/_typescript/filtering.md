---
title: Filtering
position: 16
parameters:
  - name:
    content:
content_markdown: |-
    In addition to straight search, many more specific filtering parameters
    are available. For example the `inDomain` filter restricts list results
    to only those from a specific domain, and the `tags` filter restricts
    list results to only those with a specific Tag added. The exact list
    of supported filters varies by entity. For a complete list, see the
    [API reference](reference/index.html).

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      merchi.Products.list({tags: ["big", "blue"]).then((result) => {
        for (const product of result.items) {
            console.log(product.name);
        }
      });
    title: Filtering
    language: typescript
---
