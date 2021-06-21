---
title: Embedding
position: 12
parameters:
  - name:
    content:
   As the nested entities example showed, entities don't just have scalar
   attributes like numbers and strings, but also, they can be attached to
   other entity objects.

   Since the graph of related entities may be arbitrarily deep, the nested
   entities are not included by default when fetching or listing. For example,
   `product.categories()` will be `undefined` by default, even if the product
   has categories.

   In the situation where they are really no values associated with the
   attribute, it would not be undefined, but either null, or the empty list.

   It is possible however to request specific entities be included, which is
   useful for avoiding having to make a seperate request to fetch them. This is
   done with the "embed" parameter, which is available while either listing
   entities, or fetching a single entity.
content_markdown: |-
left_code_blocks:
  - code_block: |-
     const category = new merchi.Category()
     category.id(42);
     function onSuccess() {
         const themeId = category.domain().theme().id(); 
         console.log('the id of the theme of the domain of category 42 is: ' + themeId);
     }
     const onError = console.error.bind(console);
     const embed = {'domain': {'theme': {}}};
     merchi.categories.get(onSuccess, onError, {embed: embed});
    title: Fetching nested entities.
    language: javascript
---
