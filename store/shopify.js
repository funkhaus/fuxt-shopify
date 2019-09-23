import Vue from "vue"
import _get from "lodash/get"
import _findIndex from "lodash/findIndex"
import _sumBy from "lodash/sumBy"
import _cloneDeep from "lodash/cloneDeep"

// GQL queries and mutations
import { CheckoutCreate, ReplaceCheckout } from "~/gql/mutations/Shopify.gql"
import { CheckoutById } from "~/gql/queries/Shopify.gql"

// Helper utlities
import {
    stripLineItems,
    simplifyLineItems,
    formatMoney
} from "~/utils/Shopify.js"

// Define State defaults
export const state = () => ({
    loading: 0,
    checkout: {
        id: "",
        webUrl: "",
        completedAt: null
    },
    cart: {
        count: 0,
        subTotal: {},
        lineItems: []
    },
    expire: 24 * 60, // 60 days
    version: 1
})

// Define mutations
export const mutations = {
    SET_CHECKOUT(state, checkout = {}) {
        state.checkout = checkout

        // Set line items and totals
        let lineItems = stripLineItems(checkout.lineItems)
        Vue.set(state.cart, "subTotal", checkout.subtotalPriceV2)
        Vue.set(state.cart, "lineItems", lineItems)

        // Set cart count
        let totalQty = _sumBy(lineItems, "quantity")
        Vue.set(state.cart, "count", totalQty)
    },
    START_LOADING(state) {
        state.loading += 1
    },
    FINISH_LOADING(state) {
        // Don't let this go below zero, so it can't get stuck in loading
        if (state.loading > 0) {
            state.loading -= 1
        }
    },
    CLEAR_CHECKOUT(state) {
        state.loading = 0

        Vue.set(state, "checkout", {
            id: "",
            webUrl: "",
            completedAt: null
        })

        Vue.set(state, "cart", {
            count: 0,
            subTotal: {},
            lineItems: []
        })
    }
}

// Define actions
export const actions = {
    // Add a product to your cart/checkout.
    // This will create a checkout if you don't have one.
    async ADD_TO_CART({ state, commit, dispatch }, { variantId, quantity }) {
        commit("START_LOADING")
        let client = this.app.apolloProvider.clients.shopify

        if (!state.checkout.id) {
            // If we don't have a checkout ID, create one (which also adds variant to cart)
            await dispatch("CREATE_CHECKOUT", { variantId, quantity })
        } else {
            // NOTE Shopify API doesn't allow updating a checkout, only replacing all lineItems.

            // Deep clone all lineItems to avoid mutating store by reference
            // SEE https://www.samanthaming.com/tidbits/35-es6-way-to-clone-an-array
            const lineItems = _cloneDeep(state.cart.lineItems)

            // See if variantId is already in cart
            let currentVariantIndex = _findIndex(lineItems, obj => {
                return (obj.variant.id = variantId)
            })

            if (currentVariantIndex >= 0) {
                // Update exsisting variant quantity
                lineItems[currentVariantIndex].quantity += quantity
            } else {
                // Add new variant to cart
                lineItems.push({
                    variant: { id: variantId },
                    quantity: quantity
                })
            }

            // Now replace the Checkout
            await dispatch("REPLACE_CHECKOUT", lineItems)
        }

        commit("FINISH_LOADING")
    },

    // Creates a checkout in Shopify, and then stores the results as checkout and cart
    async CREATE_CHECKOUT({ state, commit }, { variantId, quantity }) {
        commit("START_LOADING")
        let client = this.app.apolloProvider.clients.shopify

        const checkout = await client.mutate({
            mutation: CheckoutCreate,
            variables: {
                variantId: variantId,
                quantity: quantity
            }
        })

        commit(
            "SET_CHECKOUT",
            _get(checkout, "data.checkoutCreate.checkout", {})
        )

        commit("FINISH_LOADING")
    },

    // This allows you to set quantity of multple line items at once. Useful for cart pages.
    // To remove a product, set its quantity to 0
    async SET_QUANTITY({ state, dispatch }, lineItems) {
        // Accept a single line item, or multple in an array
        if (typeof lineItems === "object") {
            lineItems = [lineItems]
        }

        await dispatch("REPLACE_CHECKOUT", lineItems)
    },

    // This replaces the enitre checout, then stores the updated checkout and cart data
    // The Vuex cart is only updated from this action
    async REPLACE_CHECKOUT({ state, commit }, lineItems = []) {
        commit("START_LOADING")

        let client = this.app.apolloProvider.clients.shopify
        lineItems = simplifyLineItems(lineItems)

        // Remove any line items that have quantity set to 0
        lineItems = lineItems.filter(obj => obj.quantity > 0)

        const checkout = await client.mutate({
            mutation: ReplaceCheckout,
            variables: {
                checkoutId: state.checkout.id,
                lineItems: lineItems
            }
        })

        commit(
            "SET_CHECKOUT",
            _get(checkout, "data.checkoutLineItemsReplace.checkout", {})
        )

        commit("FINISH_LOADING")
    },

    // This is used to make sure the current checkout hasn't completed.
    // It's a good idea to run this on Layout mounted()
    async GET_CHECKOUT({ state, commit }) {
        commit("START_LOADING")
        let client = this.app.apolloProvider.clients.shopify

        if (state.checkout.completedAt) {
            commit("CLEAR_CHECKOUT")
        } else if (state.checkout.id) {
            const response = await client.query({
                query: CheckoutById,
                variables: {
                    checkoutId: state.checkout.id
                }
            })

            // Check that this checkout wasn't completed already
            const checkout = _get(response, "data.node", {})

            if (checkout.completedAt) {
                commit("CLEAR_CHECKOUT")
            } else {
                commit("SET_CHECKOUT", checkout)
            }
        } else {
            commit("CLEAR_CHECKOUT")
        }

        commit("FINISH_LOADING")
    }
}

// Define some getters here
export const getters = {
    cartSubTotal: state => {
        let output = ""
        if (state.cart.subTotal.amount) {
            output = formatMoney(
                state.cart.subTotal.amount,
                state.cart.subTotal.currencyCode
            )
        }

        return output
    }
}
