<template>
    <button
        class="shopify-add-to-cart"
        :disabled="!isAvailable || loading || !variantId"
        @click="updateCart()"
    >
        <slot v-if="isAvailable">
            Add to cart
        </slot>
        <slot
            v-else
            name="not-available"
            class="not-available"
        >
            Sold Out
        </slot>
    </button>
</template>
<script>
export default {
    props: {
        variantId: {
            type: String,
            default: ""
        },
        quantity: {
            type: Number,
            default: 1
        },
        isAvailable: {
            type: Boolean,
            default: true
        },

        // All props below this are used for gtag tracking purposes only, not required if that's not important to you
        productTitle: {
            type: String,
            default: ""
        },
        variantTitle: {
            type: String,
            default: ""
        },
        vendor: {
            type: String,
            default: ""
        },
        price: {
            type: [Number, String],
            default: ""
        },
        listName: {
            type: String,
            default: "Product detail page"
        },
        listPosition: {
            type: Number,
            default: 1
        },
        collection: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        classes() {
            return [
                "shopify-add-to-cart",
                this.loading,
                { "not-available": !this.isAvailable }
            ]
        }
    },
    methods: {
        async updateCart() {
            this.loading = true

            try {
                await this.$store.dispatch("shopify/ADD_TO_CART", {
                    variantId: this.variantId,
                    quantity: this.quantity
                })

                this.$emit("added-to-cart")

                // Send $gtag event here
                this.$gtag("event", "add_to_cart", {
                    items: [
                        {
                            id: this.variantId,
                            name: this.productTitle,
                            list_name: this.listName,
                            brand: this.vendor,
                            category: this.collection,
                            variant: this.variantTitle,
                            list_position: this.listPosition,
                            quantity: this.quantity,
                            price: this.price
                        }
                    ]
                })
            } catch (e) {
                this.$emit("error", e)
                console.log(e)
            }

            this.loading = false
        }
    }
}
</script>
<style lang="scss">
.shopify-add-to-cart {
}
</style>
