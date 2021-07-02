---
title: Embedding
position: 12
parameters:
  - name:
    content:
content_markdown: |-
  Because entities can be nested arbitrarily deeply (and indeed, cyclic references are possible), the fetching and listing methods do not, by default, fetch nested entities from the server. Only scalar properties (strings, numbers, dates, ...) are included.

  It is possible however to request that the server also include specific
  nested entities, to a specific depth using the `embed` parameter, as in the following example.

  On a newly fetched category `category.domain()` will be `undefined`, even if the category has a domain on the server. `undefined` means that the domain has not been included, or updated locally. If the category did not have a domain at all, `category.domain()` would instead be `null`. 'null` and `undefined` thus have seperate meanins in the merchi sdk library.
  {: .warning }

  The following example shows only fetching a single entity, but the embed parameter can also be used when listing entities.
  {: .success }

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
