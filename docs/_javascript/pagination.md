---
title: Pagination
position: 10
parameters:
  - name:
    content:
content_markdown: |-
    As there may be tens or hundreds of thousands of some types of entities, list will not return them all at once, but rather it will return one “page” of results.

    The limit option controls how many results will be returned per page (further limited by backend-enforced limits, and how many entities are actually available. Defaults to 25 if not specified.

    The offset option controls how many entities to skip over. For example, if the limit is set to 10, setting offset to 20 will give you the third page. Defaults to zero not not supplied.

    Attached to the result array sent to the success callback is a `meta`
    object containing information about how many results in total are available.
left_code_blocks:
  - code_block: |-
     function onSuccess(products) {
         console.log(`Got ${products.length} products`);
         console.log(`${products.meta.available} products are available`);
         console.log(products);
         console.assert(products.length == products.meta.count);
         console.assert(products.meta.limit == 2);
         console.assert(products.meta.offset == 3);
     }
     const onError = console.error.bind(console);
     merchi.products.get(onScuccess, onError, {offset: 3,
                                               limit: 2});
    title: Pagination
    language: javascript
---
