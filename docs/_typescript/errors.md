---
title: Error Handling
position: 13
parameters:
  - name:
    content:
content_markdown: |-
  As the typescript API uses javascript Promises, errors can be caught using
  `promise.catch()`

  The error object received will be an instance of `ApiError`;

left_code_blocks:
  - code_block: |-
      import { Merchi } from 'merchisdk/typescript/src/merchi';
      import { ApiError } from 'merchisdk/typescript/src/request';
      const merchi = new Merchi();
      merchi.Categories.get(42)
        .then(() => {
          console.log("ok, got a category");
        })
        .catch((err: ApiError) => {
          console.error(`error: ${err.errorCode} ${err.statusCode} ${err.errorMessage}`)
        });
      });
    title: error handling
    language: typescript
---
