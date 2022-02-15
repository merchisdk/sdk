---
title: Compiling
position: 4
parameters:
  - name:
    content:
content_markdown: |-
  For large projects, you may want to use a bundler like webpack, however
  for getting started, the code compiles just fine with the typescript
  compiler alone. The following command, for example, will create an
  output file named `index.js`, assuming you have written some code in a file named `index.ts`. The resulting output can be added directly to your website.
left_code_blocks:
  - code_block: |-
      tsc index.ts
    title: compile
    language: typescript
  - code_block: |-
      <script type="application/javascript" src="index.js"></script>
    title: include the compiled output
    language: html
---
