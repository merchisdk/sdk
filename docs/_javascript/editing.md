---
title: Editing an Entity
position: 7
parameters:
  - name:
    content:
content_markdown: |-
    The method for editing values on the server follows the same pattern as
    the others. It is named `patch` after the HTTP method that it uses.
    First, a javascript object should be created locally. Then, both the
    `id` primary key, and the attributes that you want to edit should be set,
    and then you may call `patch`. Like the others, `patch` accepts callbacks
    to let you know when the operation has completed.
left_code_blocks:
  - code_block: |-
     const existingProduct = new merchi.Product()
     existingProduct.id(42);  // we want to edit the product with id 42
     existingProduct.name("lentils");  // we want to change its name to lentils
     function onSuccess() {
         console.log("the product has been edited.");
     }
     const onError = console.error.bind(console);
     existingProduct.patch(onSuccess, onError);  // this call makes the network request
    title: Editing Products
    language: javascript
---
