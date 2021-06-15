---
title: Listing Entities
position: 3
parameters:
  - name:
    content:
content_markdown: |-
    A list of entities can be retrieved by taking the entity name in snakeCase and calling the `get` function on it.

    Note that callbacks must be provided to get the result.

    Also note that attributes of entity objects work in a "fluent" style.
    That means that to get the value of an attribute, you call it as an
    function, with no arguments. e.g. `entity.name()`, and to set the value,
    you provide the new value as the argument, e.g. `entity.name("fred")`.
left_code_blocks:
  - code_block: |-
     function onSuccess(products) {
         console.log("Ok, got products!);
         for (const product of products) {
             console.log(product.id());
         }
     }
     const onError = console.error.bind(console);
     const parameters = {};
     merchi.products.get(onSuccess, onError, parameters); 
    title: Listing Products
    language: javascript
---
