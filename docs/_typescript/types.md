---
title: Types vs Constructors
position: 13
parameters:
  - name:
    content:
content_markdown: |-
  To work around a small limitation in typescript, the entitiy types are
  seperated from their constructors.
  If you want to list or create entities, it must always be done through
  the constructor attached to the Merchi object. The types, however, are
  imported from the 'entities' directory. The following example demonstrates:

  Never try to directly instantiate the imported types, always go through the Merchi object.
  {: .error }
left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      import { Category } from 'merchisdk/typescript/src/entities/category';
      const merchi = new Merchi();
      const category: Category = new merchi.Category();
    title: import category type
    language: typescript
---
