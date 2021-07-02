---
title: Deleting an Entity
position: 9
parameters:
  - name:
    content:
content_markdown: |-
   Entities can be deleted via the `delete` method.

   As with editing, if you know the id of the object, you do not have to fetch it before deleting.
   {: .info }

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const categoryToDelete = new merchi.Categories();
      categoryToDelete.id = 42;
      categoryToDelete.delete().then(() => {
        console.log("ok, the category with id 42 was deleted.");
      });
    title: delete a category
    language: typescript
---
