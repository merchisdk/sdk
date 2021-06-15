---
title: Nested Editing
position: 10
parameters:
  - name:
    content:
content_markdown: |-
  Calling `save` on an entity will also automatically save any local changes to
  attached nested entities.

  In this example, we adjust edit the name of a store "through" the category
  object:

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const category = new merchi.Categories();
      category.id = 12;   // assume we already have the entity id's
      const domain = new merchi.Domains();
      domain.id = 42;
      category.domain = domain;
      domain.domain = "new-store.example.com";  // newly chosen name
      category.save().then(() => {
         console.log("ok, the category and domain are both updated.");
      });
    title: nested editing
    language: typescript
---
