import _get from "lodash/get"

/*
 * Takes a Shopiy `checkoutlineitemconnection` object and strips out the edges and nodes
 * SEE https://help.shopify.com/en/api/storefront-api/reference/object/checkoutlineitemconnection
 */
export const stripLineItems = items => {
    return _get(items, "edges", []).map(item => item.node)
}

/*
 * Takes an array of objects and returns an array of {variantId, quantity} objects
 * Useful for replacing a checkout
 * SEE https://help.shopify.com/en/api/storefront-api/reference/mutation/checkoutlineitemsreplace
 */
export const simplifyLineItems = items => {
    return items.map(obj => {
        return {
            variantId: obj.variantId || obj.variant.id,
            quantity: obj.quantity
        }
    })
}

/*
 * Takes a Shopify value, and then appends the currency to it.
 */
export const formatMoney = (value, currency) => {
    return `$${parseFloat(value).toFixed(2)} ${currency}`
}
