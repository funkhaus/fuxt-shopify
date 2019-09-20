<template>
    <div :key="variantId">
        <input
            :key="variantId"
            v-model="selectedQuantity"
            :class="['cart-quantity-input', { loading }]"
            type="number"
            min="1"
            :disabled="loading"
            pattern="[0-9]*"
            @change="quantityUpdate"
        >
    </div>
</template>

<script>
import Vue from "vue"

export default {
    props: {
        quantity: {
            type: Number,
            default: 1
        },
        variantId: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            selectedQuantity: this.quantity,
            // Placeholder for $Shopify.loading
            loading: false
        }
    },

    methods: {
        async quantityUpdate() {
            console.log("this.selectedQuantity: ", this.selectedQuantity)

            let product = {
                variantId: this.variantId,
                quantity: Number(this.selectedQuantity)
            }

            if (!product.variantId || !product.quantity) {
                console.log("Invalid line item: ", product)
                this.$emit("cart-update-quantity-error")
                return false
            }

            this.loading = true
            await this.$Shopify.updateCart(product)
            this.loading = false

            this.$emit("cart-update-quantity-success", product)

            // Vue.toasted.show("Cart updated!", {
            //     theme: "toasted-primary",
            //     position: "top-right",
            //     duration: 2000,
            //     icon: false,
            //     onClick: (e, toast) => {
            //         toast.goAway(0)
            //     }
            // })
        }
    }
}
</script>

<style lang="scss">
.cart-quantity-input {
    max-width: 60px;
    height: 45px;
    font-size: 18px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid $black;

    &.loading {
        pointer-events: none;
        background-color: $grey;
    }
}
</style>
