---
title: Editing an Entity
position: 8
parameters:
  - name:
    content:
content_markdown: |-
    Existing entities can be edited using the `update` method.

    First edit the attributes of the object locally, then call `update`

    You cna use the objects returned by `fetch` for editing, but if you already know the `id` of the entity that you wish to edit, there is no need to first fetch the entity from the server before editing; you can specify the `id` directly.
    {: .info }

left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        existing_category = Category()
        existing_category.id = 42
        existing_category.name = "dry food"  # make a correction to the name
        existing_category.update()
        print("Ok, the category name was edited")
    title: edit a category
    language: python
---
