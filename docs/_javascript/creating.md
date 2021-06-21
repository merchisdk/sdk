---
title: Creating a new entity
position: 6
parameters:
  - name:
    content:
content_markdown: |-
     As with fetching, to create a new entity on the server, you must first
     create a new entity object locally in javascript. Instead of filling in
     the objects `id`, you should fill in the data that you want to provide to
     the new object, and then call `create`. Like the other method in the
     javascript SDK, `create` takes `onSuccess` and `onError` callbacks to
     let you know when the operation has completed.
left_code_blocks:
  - code_block: |-
     const newProduct = new merchi.Product()
     newProduct.name("Beans");  // we want to create a new prodcut for beans
     newProduct.description("beans are a delicious legume");
     function onSuccess() {
         // at this point, the new product exists on the merchi server
         console.log(`the product has been created with id ${newProduct.id()}`);
     }
     const onError = console.error.bind(console);
     newProduct.create(onSuccess, onError);  // this call makes the network request
    title: Creating Products
    language: javascript
---
