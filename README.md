# Shophaus

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

### Get Shopify working with Next over graphql

-   Set up endpoint in next config and add access token to http headers
-   Write queries to:
    -   Get products by collection
    -   Get all products
    -   Get products by tags
    -   Get cart
    -   Get Variants
    -   Get Metafields
    -   Update cart
    -   Clear cart
    -   Get collections

### Build Shopify theme

-   User Login/Account
-   Theme Settings
-   Checkout confirmation
-   Analytics?

### Build Vue components:

-   Product gallery
-   Cart
-   Cart Icon
-   Add to cart button
-   Variants
-   Collections Menu

## Important Readings

Built around the Storefront API
https://help.shopify.com/en/api/storefront-api

Integrated with Google Tag Manager for Enhanced Ecommerce
https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce

## Instructions

Note that for the Shopify API there is no "cart", they refer to that as a "Checkout".

Explain Loading property increments event

1. In Nuxt config, set shopify endpoint and headers, get your Shopify access token here (where?).

Explain all the store actions

## Required files

1.  All files in `~/gql`
1.  The Shopify store module at `~/store/shopify.js`
1.  The Shopify utility file at `~/utils/shopify.js`

### Optional files

1.  The page in `~/components/shop` and `~/components/cart` are useful, but they are optional.
1.  All the components in `~/components/shopify` are useful, but they are optional.

## TODO list

TODO improvements:

1.  Include some links to related links, things like Shopify API docs that etc...
1.  Get \$gtag working for "Enhanced eCommerce" tracking
1.  Product-select, if no slot should become a dropdown

-   Add to cart

    -   if we have cart: add line item
    -   else: create cart then add line item

-   Update quantity:

    -   if qty = 0, remove from cart
    -   else update line item

-   On page load:
    -   If we have cart id, check that it didn't checkout
        -   If has checked out, clear cart

```
gtag('event', 'add_to_cart', {
  "items": [
    {
      "id": "P12345",
      "name": "Android Warhol T-Shirt",
      "list_name": "Search Results",
      "brand": "Google",
      "category": "Apparel/T-Shirts",
      "variant": "Black",
      "list_position": 1,
      "quantity": 2,
      "price": '2.0'
    }
  ]
});
```

Variant ID: `Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDExODIzMTgwMTkwOQ==`
Checkout ID: `"Z2lkOi8vc2hvcGlmeS9DaGVja291dC8yY2FkZDZlMzIyZGM5ZGEyZjEyYzMxNDg1MDBlYWU4YT9rZXk9YmE2ZjBjZWFkMTE1Mjk3NTQ1NjkyZTZkYTQ5Y2RlZWU="`
