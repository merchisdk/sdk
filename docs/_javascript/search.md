---
title: Searching
position: 11
parameters:
  - name:
    content:
content_markdown: |-
    Most entities also accept a `q` parameter in their list method, which
    allows you to filter by search terms. The following example shows how
    to search for products related to eggs (the returned products might have
    the word egg in their names, or descriptions, or might be in a category
    named egg, or so one).
left_code_blocks:
  - code_block: |-
     function onSuccess(products) {
         for (const product of products) {
           console.log(product.name());
         }
     }
     const onError = console.error.bind(console);
     merchi.products.get(onSuccess, onError, {q: "egg"});
    title: Searching for egg products
    language: javascript
---
