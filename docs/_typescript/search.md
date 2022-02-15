---
title: Searching
position: 15
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
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      merchi.Products.list({q: "egg").then((result) => {
        for (const product of result.items) {
            console.log(product.name);
        }
      });
    title: searching
    language: typescript
---
