---
title: The Merchi object
position: 2
parameters:
  - name:
    content:
content_markdown: |-
    All functionality is contained in a Merchi object which must manually be initialised. This helps with namespacing. The remainder of the examples in this document will assume that you have already set up a `merchi` object as follows:
left_code_blocks:
  - code_block: |-
      const merchi = SDK.merchi("https://api.merchi.co/", "https://websockets.merchi.co/");
    title: merchi object
    language: javascript
---
