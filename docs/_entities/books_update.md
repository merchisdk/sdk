---
title: /books/:id
position: 1.4
type: put
description: Update Book
parameters:
  - name: title
    content: The title for the book
  - name: score
    content: The book's score between 0 and 5
content_markdown: |-
  Update an existing book in your collection.
left_code_blocks:
  - code_block: |-
      $.ajax({
        "url": "http://api.myapp.com/books/3",
        "type": "PUT",
        "data": {
          "token": "YOUR_APP_KEY",
          "score": 5.0,
          "title": "The Book Stealer"
        },
        "success": function(data) {
          alert(data);
        }
      });
    title: jQuery
    language: javascript
---
