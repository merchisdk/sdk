---
title: Deleting an Entity
position: 8
parameters:
  - name:
    content:
content_markdown: |-
    Entities can be deleted via the `destroy` method.

    If you know the id of the entity you do not have to fetch it before deleting.
left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        old_category = Category()
        old_category.id = 42
        old_category.destroy()
        print(f"Ok, the category was deleted")
    title: delete a category
    language: python
---
