---
title: Fetching a Single Entity
position: 6
parameters:
  - name:
    content:
content_markdown: |-
  Almost every entity in merchi is referenced by its `id`.

  Once you have the id of an object, you can fetch that entity specifically
  using the `get` static method:
left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const categoryId = 42;
      const myCategory = merchi.Categories.get(categoryId);
      console.log(myCategory.name);
    title: fetch a category
    language: typescript
---
