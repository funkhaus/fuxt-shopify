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

## Important Readings

Built around the Storefront API
https://help.shopify.com/en/api/storefront-api

Integrated with Google Tag Manager for Enhanced Ecommerce
https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce

## Install Instructions

Note that for the Shopify API there is no "cart", they refer to that as a "Checkout". We have tried to follow that convention.

1.  Install required packages. See dependencies in `package.json` file for list.
1.  In Nuxt config, set Shopify endpoint and headers, get your Shopify access token here (where?).
1.  Copy settings from `nuxt.config.js`

## Required files

1.  All files in `~/gql`
1.  The Shopify store module at `~/store/shopify.js`
1.  The Shopify utility file at `~/utils/shopify.js`

### Optional files

1.  The pages in `~/pages` are useful, but are technically optional.
1.  All the components in `~/components/shopify` are useful, but are technically optional.

## TODO list

TODO improvements:

1.  Get cart page built
1.  Clear checkout on completion (Webhooks? Some other way? If site referrer URL is the shopify url?)
1.  Document all the store actions
1.  Document Loading property and it's increments events
1.  Figure out how to query for Shopify menus?
1.  Get `this.gtag` working in all places (remove from cart, update cart quantity etc)
1.  Build Shopify theme
    1.  User Login/Account
    1.  Theme Settings
    1.  Checkout confirmation?
