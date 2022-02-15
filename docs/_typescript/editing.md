---
title: Editing an Entity
position: 8
parameters:
  - name:
    content:
content_markdown: |-
  Existing entities can be edited using the `save` method.

  First edit the attributes of the object locally, ensure that the `id`
  attribute is set, and then call `save`. 

  You can use the objects returned by `list` or `get` for editing as those objects will have their `id` filled in. But if you already know the `id` of the entity that you wish to edit, there is no need to first fetch the entity from the server before editing, you can specify the `id` directly.
  {: .info }

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const categoryToEdit = new merchi.Categories();
      categoryToEdit.id = 42;
      categoryToEdit.name = "dry food"; // make a correction to the name
      categoryToEdit.save().then(() => {
        console.log("ok, the category name was edited.");
      });
    title: edit a category
    language: typescript
---
