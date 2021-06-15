---
title: /books/:id
position: 1.3
type: get
description: Get Book
parameters:
  - name:
    content:
content_markdown: |-
  Returns a specific book from your collection
left_code_blocks:
  - code_block: |-
      $.get("http://api.myapp.com/books/3", {
        token: "YOUR_APP_KEY",
      }, function(data) {
        alert(data);
      });
    title: jQuery
    language: javascript
---
