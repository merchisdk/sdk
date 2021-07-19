---
title: Filtering
position: 13
parameters:
  - name:
    content:
content_markdown: |-
    In addition to straight search, many more specific filtering parameters
    are available. For example the `inDomain` filter restricts list results
    to only those from a specific domain, and the `tags` filter restricts
    list results to only those with a specific Tag added. The exact list
    of supported filters varies by entity. For a complete list, see the
    [Filtering Feference](sdk/#filtersfilter).
left_code_blocks:
  - code_block: |-
     function onSuccess(products) {
         for (const product of products) {
           console.log(product.name());
         }
     }
     const onError = console.error.bind(console);
     merchi.products.get(onSuccess, onError, {tags: "big,blue"});
    title: Searching for egg products
    language: javascript
---
