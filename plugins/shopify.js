import Vue from "vue"
import _get from "lodash/get"
import _find from "lodash/find"

import { CheckoutById } from "~/queries/ShopifyQuery.gql"
import {
    CheckoutCreate,
    ReplaceCheckout,
    CheckoutLineItemsRemove
} from "~/mutations/CheckoutMutation.gql"

export default ({ store, app: { router, context } }, inject) => {
    console.log("Init $Shopify plugin!")
    // Set Shopify apollo client:
    let client = context.app.apolloProvider.clients.shopify

    const Shopify = {
        loading: false, //TODO: PLUGIN loading Not Working
        init() {
            // Inits plugins, Checks if checkoutId is in $store, retrieves data from shopify, commits result to store
            console.log("Looking for checkout: ")
            if (store.state.shop.checkout.id) {
                this.getCheckoutById()
            } else {
                console.log("No checkout found")
                return false
            }
        },
        async addToCart(product = {}) {
            // Add product to cart
            console.log("Adding to cart: ", product)

            if (!store.state.shop.checkout.id) {
                console.log("No checkout currently exists")

                return await this.createCheckout(product)
            }

            console.log("Checkout exists")
            if (Helpers.isProductInCheckout(product)) {
                Helpers.updateLineItem(product)

                return await this.updateCheckout()
            } else {
                Helpers.addLineItem(product)

                return await this.updateCheckout()
            }
        },
        async updateCart(lineItem = {}) {
            // Updates checkout from cart page
            Helpers.replaceLineItem(lineItem)
            return await this.updateCheckout()
        },

        /* QUERIES */
        async getCheckoutById() {
            // Gets shopify checkout by ID
            console.log(
                "Getting checkout by ID: ",
                store.state.shop.checkout.id
            )

            if (!store.state.shop.checkout.id) {
                console.log("Error retrieving checkout: No checkout ID")
                return false
            }

            try {
                // this.loading = true
                let checkout = await Queries.getCheckoutByIdQuery()
                console.log("full checkout: ", checkout)
                checkout = _get(checkout, "data.node", {})

                if (Helpers.isCheckoutComplete(checkout)) {
                    console.log("checkout is complete")
                    Helpers.clearCheckout()
                    Helpers.clearCart()
                    return checkout
                }

                Helpers.filterProducts(checkout.lineItems)
                Helpers.formatLineItems(checkout.lineItems)
                Helpers.setCount()
                Helpers.setSubtotal(checkout.lineItems)

                // this.loading = false
                return checkout
            } catch (err) {
                console.log("GET CHECKOUT ERROR: ", err)
                throw new Error("GET CHECKOUT ERROR:")
            }
        },

        /* MUTATIONS */
        async createCheckout(lineItem = {}) {
            console.log("Creating checkout with product:", lineItem)
            // Abort if no line item exists
            if (!lineItem.variantId || !lineItem.quantity) {
                console.log(
                    "Error creaing checkout: invalid line item",
                    lineItem
                )
                // return false
                throw new Error("Error creaing checkout: invalid line item")
            }

            try {
                let checkout = await Queries.createCheckoutMutate(lineItem)

                checkout = _get(checkout, "data.checkoutCreate.checkout", {})
                console.log("checkout ", checkout)

                Helpers.setCheckoutId(checkout.id)
                Helpers.setWebUrl(checkout.webUrl)
                Helpers.setCartToken(checkout.webUrl)

                Helpers.formatLineItems(checkout.lineItems)
                Helpers.filterProducts(checkout.lineItems)

                Helpers.setCount()
                Helpers.setSubtotal(checkout.lineItems)

                return checkout
            } catch (err) {
                console.log("Error creating checkout: ", err)
                throw new Error("Error creating checkout")
            }
        },

        async updateCheckout() {
            console.log(
                "Updating checkout with lineItems:",
                store.state.shop.cart.lineItems,
                "ID: ",
                store.state.shop.checkout.id
            )

            if (!store.state.shop.checkout.id) {
                console.log("Error updating cart, no checkout ID")
                // return false
                throw new Error("Error creating checkout")
            }

            try {
                let checkoutUpdate = await Queries.updateCheckoutMutate()

                checkoutUpdate = _get(
                    checkoutUpdate,
                    "data.checkoutLineItemsReplace.checkout",
                    {}
                )

                Helpers.formatLineItems(checkoutUpdate.lineItems)
                Helpers.filterProducts(checkoutUpdate.lineItems)

                Helpers.setSubtotal(checkoutUpdate.lineItems)
                Helpers.setCount()

                return checkoutUpdate
            } catch (err) {
                console.log("UPDATE ERROR: ", err)
                throw new Error("UPDATE ERROR")
            }
        },

        async removeFromCart(lineItemId) {
            if (!lineItemId || !store.state.shop.checkout.id) {
                console.log(
                    "Error, invalid lineItem or checkout id: ",
                    lineItemId,
                    store.state.shop.checkout.id
                )
                return false
            }

            console.log("Removing lineItem: ", lineItemId)

            try {
                let checkoutUpdate = await Queries.removeFromCartMutate(
                    lineItemId
                )

                checkoutUpdate = _get(
                    checkoutUpdate,
                    "data.checkoutLineItemsRemove.checkout",
                    {}
                )

                Helpers.formatLineItems(checkoutUpdate.lineItems)
                Helpers.filterProducts(checkoutUpdate.lineItems)

                Helpers.setSubtotal(checkoutUpdate.lineItems)
                Helpers.setCount()

                return checkoutUpdate
            } catch (err) {
                console.log("Error removing item: ", error)
                throw new Error("Error removing item")
            }
        }
    }

    const Queries = {
        /* MUTATIONS */
        removeFromCartMutate(lineItemId) {
            return new Promise((resolve, reject) => {
                const checkoutUpdate = client.mutate({
                    mutation: CheckoutLineItemsRemove,
                    variables: {
                        checkoutId: store.state.shop.checkout.id,
                        lineItemIds: [lineItemId]
                    }
                })

                checkoutUpdate
                    ? resolve(checkoutUpdate)
                    : reject(new Error("Failed to remove item from  Checkout"))
            })
        },
        updateCheckoutMutate() {
            return new Promise((resolve, reject) => {
                const checkoutUpdate = client.mutate({
                    mutation: ReplaceCheckout,
                    variables: {
                        checkoutId: store.state.shop.checkout.id,
                        lineItems: store.state.shop.cart.lineItems
                    }
                })

                checkoutUpdate
                    ? resolve(checkoutUpdate)
                    : reject(new Error("Failed to update Checkout"))
            })
        },
        createCheckoutMutate(lineItem) {
            return new Promise((resolve, reject) => {
                const checkout = client.mutate({
                    mutation: CheckoutCreate,
                    variables: {
                        variantId: lineItem.variantId,
                        quantity: lineItem.quantity
                    }
                })

                checkout
                    ? resolve(checkout)
                    : reject(new Error("Failed to create new Checkout"))
            })
        },
        getCheckoutByIdQuery() {
            return new Promise((resolve, reject) => {
                const checkout = client.query({
                    query: CheckoutById,
                    variables: {
                        id: store.state.shop.checkout.id
                    }
                })
                // NOTE: timeout is example / proof of working async
                // console.log("waiting...")
                // setTimeout(function() {
                // console.log("done!")
                checkout
                    ? resolve(checkout)
                    : reject(new Error("Failed to create new Checkout"))
                // }, 2000)
            })
        }
    }

    const Helpers = {
        isCheckoutComplete(checkout) {
            console.log(checkout)
            if (checkout.completedAt) {
                console.log("checkout complete")
                return true
            } else {
                console.log("checkout incomplete")
                return false
            }
        },
        isProductInCheckout(product = {}) {
            // Checks if product is in checkout
            console.log("Searching for product in cart: ", product)
            let lineItems = store.state.shop.cart.lineItems

            if (!lineItems) {
                console.log("ERROR, no products in cart")
                return false
            }

            return _find(lineItems, ["variantId", product.variantId])
                ? true
                : false
        },
        formatLineItems(unfilteredItems) {
            // Iterates through line lineItems, returns formatted array [{id, qty}]
            console.log("Formatting unfilteredItems: ", unfilteredItems)
            if (!unfilteredItems) {
                return false
            }
            // Cleans up graphql response
            let lineItems = unfilteredItems.edges.map(lineItem => lineItem.node)
            // Formats line Items
            let filteredItems = []
            for (let i of lineItems) {
                filteredItems.push({
                    variantId: i.variant.id,
                    quantity: i.quantity
                })
            }

            console.log("FilteredItems ", filteredItems)
            // this.setLineItems(filteredItems) // commit to store
            this.setLineItems(filteredItems)
            return filteredItems
        },
        filterProducts(unfilteredItems) {
            // Filters out edges and nodes from collections, returns array of prods [{prod},{prod}] for use in cart
            console.log("Filtering products: ", unfilteredItems)
            if (!unfilteredItems) {
                return false
            }
            // Cleans up graphql response
            let products = unfilteredItems.edges.map(lineItem => lineItem.node)
            console.log("Filtered products: ", products)

            this.setProducts(products)
            return true
        },

        setLineItems(lineItems) {
            // Commits line items in store
            if (!lineItems) {
                return false
            }
            console.log("Setting line items: ", lineItems)
            store.commit("shop/SET_LINE_ITEMS", lineItems)
        },
        addLineItem(product = {}) {
            // Adds line item to store
            if (!product) {
                return false
            }
            store.commit("shop/ADD_LINE_ITEM", product)
            return true
        },
        updateLineItem(lineItem = {}) {
            // Updates line item in store
            if (!lineItem) {
                return false
            }
            console.log("UpdateLineItem: ", lineItem)
            store.commit("shop/UPDATE_LINE_ITEM", lineItem)
            return true
        },
        replaceLineItem(lineItem = {}) {
            // Replaces Line item in store
            console.log("ReplaceLineItem: ", lineItem)
            if (!lineItem) {
                return false
            }
            store.commit("shop/REPLACE_LINE_ITEM", lineItem)
            return true
        },
        removeItem(lineItem = {}) {
            // Removes line item from store
            console.log("removeLineItem: ", lineItem)
            if (!lineItem) {
                return false
            }
            store.commit("shop/REMOVE_LINE_ITEM", lineItem)
            return true
        },

        setProducts(products) {
            // Commits products to store
            console.log("Setting products:", products)
            if (!products) {
                return false
            }
            store.commit("shop/SET_PRODUCTS", products)
        },
        setCheckoutId(checkoutId) {
            // Commits checkoutId to store
            console.log("Setting checkoutId: ", checkoutId)
            if (!checkoutId) {
                return false
            }
            store.commit("shop/SET_CHECKOUT_ID", checkoutId)
        },
        setWebUrl(webUrl) {
            // Commits webUrl to store
            console.log("Setting checkout Url: ", webUrl)
            if (!webUrl) {
                return false
            }
            store.commit("shop/SET_CHECKOUT_URL", webUrl)
        },
        // QUESTION: Should this be two seperate functions?
        setCartToken(webUrl) {
            // Parses webUrl to get token to match to webHook, commits to store
            console.log("Setting checkout token: ", webUrl)
            if (!webUrl) {
                return false
            }
            const token = webUrl.split("/")[5].split("?")[0]
            store.commit("shop/SET_CHECKOUT_TOKEN", token)
        },
        setCount() {
            // Iterates through line lineItems, returns total product Count
            let lineItems = store.state.shop.cart.lineItems || []
            console.log("Calculating total cart items: ", lineItems)
            if (!lineItems) {
                return false
            }
            let total = 0
            for (let i of lineItems) {
                total += i.quantity
            }
            console.log("Total: ", total)
            store.commit("shop/SET_CART_COUNT", total)
            return total
        },
        setSubtotal(unfilteredItems) {
            // Iterates through unfiltered lineItems, returns subtotal price
            console.log("Calculating total price: ", unfilteredItems)
            if (!unfilteredItems) {
                return false
            }

            let lineItems = unfilteredItems.edges.map(lineItem => lineItem.node)
            let sum = 0
            for (let i of lineItems) {
                sum += i.variant.priceV2.amount * i.quantity
            }

            console.log("Total price: ", sum)

            store.commit("shop/SET_CART_SUBTOTAL", sum)
            return sum
        },
        // IDEA: This should be called when there is a get cart id error t00
        clearCheckout() {
            // NOTE: There is not a shopify gql destroy cart mutation
            console.log("clearing checkout...")
            store.commit("shop/SET_CHECKOUT_ID", "")
            store.commit("shop/SET_CHECKOUT_TOKEN", "")
            store.commit("shop/SET_CHECKOUT_URL", "")
        },
        clearCart() {
            console.log("clearing cart...")
            store.commit("shop/SET_CART_COUNT", 0)
            store.commit("shop/SET_LINE_ITEMS", [])
            store.commit("shop/SET_PRODUCTS", [])
            store.commit("shop/SET_CART_SUBTOTAL", 0)
        }
    }

    // Run on first load:
    Shopify.init()

    inject("Shopify", Shopify)
}
