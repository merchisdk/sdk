---
title: Creating a New Entity
position: 7
parameters:
  - name:
    content:
content_markdown: |-
  New entities can be added to the system with the `create` method.

  First create a new SDK object using the constructor given by the merchi
  object, then set up some values on the new object, and then call `create`.

  Creating and editing objects locally has no effect on the server. Only after you call `create` will the object actually be stored with merchi.
  {: .info }

  You do not need to assign an `id` when setting up the object, merchi will create one for the new object automatically.
  {: .info }
left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const newCategory = new merchi.Categories();
      newCategory.name = "canned food";
      newCategory.create().then(() => {
        console.log("The new categories id is: " + newCategory.id);
      });
    title: create a category
    language: typescript
---
