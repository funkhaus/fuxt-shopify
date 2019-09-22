import _get from "lodash/get"
import Vue from "vue"

// Define State defaults
export const state = () => ({
    checkout: {
        id: "",
        webUrl: "",
        token: ""
    },
    cart: {
        count: 0,
        subTotal: 0,
        lineItems: [],
        products: []
    }
})

// Define mutations
export const mutations = {
    /* Checkout */
    SET_CHECKOUT_ID(state, id) {
        Vue.set(state.checkout, "id", id)
    },
    SET_CHECKOUT_URL(state, url) {
        Vue.set(state.checkout, "webUrl", url)
    },
    SET_CHECKOUT_TOKEN(state, token) {
        Vue.set(state.checkout, "token", token)
    },
    /* Cart */
    SET_CART_SUBTOTAL(state, number) {
        Vue.set(state.cart, "subTotal", number)
    },
    SET_CART_COUNT(state, number) {
        Vue.set(state.cart, "count", number)
    },
    /* Products */
    SET_PRODUCTS(state, products) {
        Vue.set(state.cart, "products", products)
    },
    /* Line Items */
    SET_LINE_ITEMS(state, data) {
        Vue.set(state.cart, "lineItems", data)
    },
    UPDATE_LINE_ITEM(state, product) {
        state.cart.lineItems.forEach((item, i) => {
            if (item.variantId === product.variantId) {
                let qty = (item.quantity += Number(product.quantity))
                Vue.set(state.cart.lineItems[i], "quantity", qty)
            }
        })
    },
    REPLACE_LINE_ITEM(state, product) {
        state.cart.lineItems.forEach((item, i) => {
            if (item.variantId === product.variantId) {
                Vue.set(
                    state.cart.lineItems[i],
                    "quantity",
                    Number(product.quantity)
                )
            }
        })
    },
    ADD_LINE_ITEM(state, lineItem) {
        let arr = state.cart.lineItems
        arr.push(lineItem)
        Vue.set(state.cart, "lineItems", arr)
    },
    REMOVE_LINE_ITEM(state, lineItem) {
        let arr = state.cart.lineItems
        arr.forEach((item, i) => {
            if (arr[i].variantId === lineItem.variantId) {
                arr.splice(i, 1) // remove from array
                Vue.set(state.cart, "lineItems", arr)
            }
        })
    }
}
