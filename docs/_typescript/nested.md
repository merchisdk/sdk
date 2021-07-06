---
title: Creating Nested entities
position: 10
parameters:
  - name:
    content:
content_markdown: |-
  Entities can have relationships to other entities.

  For example, categories are always linked to a `domain`, which is the Merchi
  name for a store.

  When creating an entity, you can attach a Merchi `Domain` object to the
  category object, in order to specify when domain it should be attached to.
left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const newCategory = new merchi.Categories();
      const existingDomain = new merchi.Domains();
      existingDomain.id = 42;  // note: this id already exists
      newCategory.domain = existingDomain;
      newCategory.name = "vegetables";
      newCategory.create().then(() => {
        console.log("ok, new vegetables category created on domain 42");
      });
    title: create a category with a domain
    language: typescript
---
