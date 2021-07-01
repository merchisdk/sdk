---
title: Creating a New Entity
position: 6
parameters:
  - name:
    content:
content_markdown: |-
    New entities can be added to the system with the `create` method.

    First create a new SDK object for the entity, then set up some values
    on the new object, and then call create.

    Creating and editing objects locally has no effect on the server. Only after you call `create` will the object actually be stored with merchi.
    {: .info }

    You do not need to assign an `id` when setting up the object, merchi will create one for the new object automatically.
    {: .info }
left_code_blocks:
  - code_block: |-
        from sdk.python.categories import Category
        new_category = Category()
        category.name = "canned food"
        category.create()
        print(f"The new category id is: {category.id}")
    title: create a category
    language: python
---
