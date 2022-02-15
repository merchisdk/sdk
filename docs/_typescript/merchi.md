---
title: The Merchi object
position: 3
parameters:
  - name:
    content:
content_markdown: |-
  All functionality is available via the `Merchi` class. Your first step
  when using the typescript SDK must be to create an instance of this class.

  Most types of requests against the Merchi API need to be authenticated.
  If your code will be running in a web browser environment, the Merchi
  object will automatically fetch the sessiont token of the currently
  logged in user from the Merchi cookie. Alternatively you can provide
  the optional `sessionToken` argument to the `Merchi` constructor. For
  example, you could put something like this into a file named `index.ts`.

  You may need to adjust the import path in the examples, if you have not
  placed the typescript SDK into "merchisdk/typescript/".
left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      const sessionToken = "rk1fGoPW7cyxa8cCLR45CigUtjkO1iCWWuLrK08CDaYD2gHoPHYtF7KsfTgmFcwl8tOyQssaIchgzbTSarjk8A";
      const merchi = new Merchi(sessionToken);
    title: setup merchi object
    language: typescript
---
