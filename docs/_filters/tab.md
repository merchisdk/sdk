---
title: tab
position: 3
parameters:
  - name:
    content:
content_markdown: |-
   The `tab` filter should be given a string representing the tab name.

   It restricts the result set to entities which would make sense displayed
   in a seperate UI tab.

   The following tab names are available on `Notification` entities:

      - read
      - unread

   The following tab names are available on `Invoice` entities:

      - all (does nothing)
      - overdue
      - unpaid

   The following tab names are available on `Job` entities:

      - all (does nothing)
      - The name of any Category entity

   The following tab names are available on `Shipment` entities:

      - receiving (the user is the receiver)
      - sending  (the user is the sender)

   The following tab names are available on `Usera entities:

      - super (only super user admins)

   The following tab names are available on `Theme` entities:

      - public (only publically accessable themes)

left_code_blocks:
  - code_block:
    title:
    language:
---
