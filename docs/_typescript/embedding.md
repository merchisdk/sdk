---
title: Embedding
position: 10
parameters:
  - name:
    content:
content_markdown: |-
  Because entities can be nested arbitrarily deeply `get` and `list` do not,
  by default, fetch nested entities from the server. Only scalar properties
  (strings, numbers, dates, ...) are included.

  It is possible however to request that the server also include specific
  nested entities using the `embed` parameter, as in the following example.

  On a newly fetched category `category.domain` will be `undefined`, even if the category has a domain on the server. `undefined` means that the domain has not been included, or updated locally. If the category did not have a domain at all, `category.domain` would instead be `null`. 'null` and `undefined` thus have seperate meanins in the merchi sdk library.
  {: .warning }

  The following example shows only `get`, but the embed parameter can be used with both `get` and `list` methods.
  {: .success }

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const merchi = new Merchi();
      const embed = {'domain': {'theme': {}}};
      merchi.Categories.get(42, {embed: embed}).then((category) =>
         const themeId = category.domain.theme.id;
         console.log('the id of the theme of the domain of category 42 is: ' + themeId);
      });
    title: embedding
    language: typescript
---
