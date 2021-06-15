---
title: /books
position: 1.0
type: get
description: List all books
parameters:
  - name: offset
    content: Offset the results by this amount
  - name: limit
    content: Limit the number of books returned
content_markdown: |-
  This call will return a maximum of 100 books
  {: .info }

  Lists all the photos you have access to. You can paginate by using the parameters listed above.
left_code_blocks:
  - code_block: |-
      $.get("http://api.myapp.com/books/", { "token": "YOUR_APP_KEY"}, function(data) {
        alert(data);
      });
    title: jQuery
    language: javascript
  - code_block: |-
      r = requests.get("http://api.myapp.com/books/", token="YOUR_APP_KEY")
      print r.text
    title: Python
    language: python
  - code_block: |-
      var request = require("request");
      request("http://api.myapp.com/books?token=YOUR_APP_KEY", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    title: Node.js
    language: javascript
  - code_block: |-
      curl http://sampleapi.readme.com/orders?key=YOUR_APP_KEY
    title: Curl
    language: bash
---
