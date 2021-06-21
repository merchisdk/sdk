---
title: Fetching a single Entity
position: 5
parameters:
  - name:
    content:
content_markdown: |-
    The API for fetching a single entity is different to that in the typesctipt
    API. You must first create an entity object locally, and then set the id
    value, and call `get` on it.

    Success and failure callbacks should be provided in order to know when
    the operation is complete, but it is the original provided entity that
    gets "filled in" with data from the server.
left_code_blocks:
  - code_block: |-
     const product = new merchi.Product()
     product.id(42);   // we want the product with id 42.
     function onSuccess() {
         // at this point, `product` has been updated from the merchi server.
         console.log(`the product name is: ${product.name()}`);
     }
     const onError = console.error.bind(console);
     product.get(onSuccess, onError);  // this call makes the network request
    title: Listing Products
    language: javascript
---
