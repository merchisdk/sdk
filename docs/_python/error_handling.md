---
title: Error Handling
position: 15
parameters:
  - name:
    content:
content_markdown: |-
    The python SDK raises `python.util.api_error.ApiError` in case of failure.
left_code_blocks:
  - code_block: |-
        import sdk.python.products
        from sdk.python.util.api_error import ApiError
        try:
            products, _ = sdk.python.product.products.fetch()
        except ApiError as e:
            print(e.message)
            print(e.status_code)
            print(e.error_code)
        else:
            for product in products:
                print(product.name)
    title: error handling
    language: python
---
