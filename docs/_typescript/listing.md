---
title: Listing Entities
position: 5
parameters:
  - name:
    content:
content_markdown: |-
  Merchi breaks up entities into different types, which loosely corrospond to
  REST resources. For each type, there is normally many specific entities
  available. Once you have set up the `merchi` object, you can get an array
  of entities with the `list` method. For example, here is how to get 
  an array of 'categories' in the system (categories are groupings of products):
left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      merchi.Categories.list().then((result) => {
        for const (category of result.items) {
          console.log(category.id, category.name);
        }
      });
    title: list categories
    language: typescript
---