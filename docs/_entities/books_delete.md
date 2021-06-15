---
title: /books/:id
position: 1.5
type: delete
description: Deletes a book
parameters:
  - name:
    content:
content_markdown: |-
  Deletes a book in your collection.
left_code_blocks:
  - code_block: |-
      $.ajax({
        "url": "http://api.myapp.com/books/3",
        "type": "DELETE",
        "data": {
          "token": "YOUR_APP_KEY"
        },
        "success": function(data) {
          alert(data);
        }
      });
    title: jQuery
    language: javascript
---

