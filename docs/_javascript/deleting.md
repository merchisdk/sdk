---
title: Deleting an Entity
position: 8
parameters:
  - name:
    content:
content_markdown: |-
    To remove an entity from the server, you must create a javascript object
    locally, set it's `id` attribute, and then call the `destroy` method.
left_code_blocks:
  - code_block: |-
     const existingProduct = new merchi.Product()
     existingProduct.id(42);  // we want to delete the product with id 42
     function onSuccess() {
         console.log("the product is gone");
     }
     const onError = console.error.bind(console);
     existingProduct.destroy(onSuccess, onError);  // this call makes the network request
    title: Deleting a Product
    language: javascript
---
