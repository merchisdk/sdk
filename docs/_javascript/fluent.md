---
title: Fluent API
position: 3
parameters:
  - name:
    content:
content_markdown: |-
    Entities in the javascript SDK (unlike the typescript SKD) use a fluent
    style API.

    That means that to get the value of an attribute, you must call a method
    with that name, giving no arguments, and it will return the value.

    To set the value, you must call the same method, but providing the
    new value. When setting a value, the original object will be returned,
    which lets you 'chain' attribute setting calls.

left_code_blocks:
  - code_block: |-
      // getting and setting
      const domain = new merchi.Domain()
      console.assert(domain.domain() === undefined, "attribute not yet set");
      const name = "new-value.example.com";
      const domain2 = domain.domain(name);
      console.assert(domain2 === domain, "the original domain is returned");
      console.assert(domain.domain() === name, "attribute has now been set");

      // example of chaining multiple sets and a single get into one line
      const logoUrl = domain.domain("even-newer-value.example.com")
            .smsName("sms.example.com")
            .enableSmsNotifications(true)
            .enableEmailNotifications(false)
            .logoUrl()
      console.assert(domain.enableSmsNotifications(), "was set to true");
      console.assert(!domain.enableEmailNotifications(), "was set to false");
    title: Getting and selecting attributes
    language: javascript
---
