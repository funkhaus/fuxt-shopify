<template>
    <button
        class="update-quantity"
        @click="updateCart()"
    >
        Set quantity to {{ this.quantity }}
    </button>
</template>
<script>
export default {
    props: {
        variantId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
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
        }
    },
    methods: {
        async updateCart() {
            try {
                await this.$store.dispatch("shopify/SET_QUANTITY", {
                    variantId: this.variantId,
                    quantity: this.quantity
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>
<style lang="scss">
.add-to-cart {
}
</style>
