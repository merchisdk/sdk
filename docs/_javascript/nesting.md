---
title: Creating Nested Entities
position: 9
parameters:
  - name:
    content:
content_markdown: |-
     As with the typescript SDK, nested entities can be created at once.
     For example, you might create a product and its category in the
     same request. 
left_code_blocks:
  - code_block: |-
     const newProduct = new merchi.Product();
     newProduct.name("lime");
     newProduct.description("limes are green");
     const newCategory = new merchi.Category();
     newCategory.name("fruits");
     // note that an array is provided as products may be in
     // multiple categories.
     newProduct.categories([newCategory]);
     function onSuccess() {
         console.log("the product and category both now exist");
     }
     const onError = console.error.bind(console);
     newProduct.create(onSuccess, onError);  // this call makes the network request
    title: Creating a product and category at once
    language: javascript
---
