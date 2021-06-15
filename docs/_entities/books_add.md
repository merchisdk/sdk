---
title: /books
position: 1.1
type: post
description: Create Book
parameters:
  - name: title
    content: The title for the book
  - name: score
    content: The book's score between 0 and 5
content_markdown: |-
  The book will automatically be added to your reading list
  {: .success}

  Adds a book to your collection.
left_code_blocks:
  - code_block: |-
      $.post("http://api.myapp.com/books/", {
        "token": "YOUR_APP_KEY",
        "title": "The Book Thief",
        "score": 4.3
      }, function(data) {
        alert(data);
      });
    title: jQuery
    language: javascript
---


