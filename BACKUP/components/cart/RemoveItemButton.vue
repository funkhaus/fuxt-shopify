<template>
    <button
        :key="productId"
        :class="['remove-button', { loading }]"
        @click.prevent="removeItem()"
    >
        Remove
    </button>
</template>

<script>
import Vue from "vue"

export default {
    props: {
        productId: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async removeItem() {
            console.log("removing...", this.productId)
            if (!this.productId) {
                this.$emit("remove-from-cart-error")
                return false
            }

            await this.$Shopify.removeFromCart(this.productId)

            this.$emit("remove-from-cart-success", this.productId)

            // Vue.toasted.show("Product removed from cart!", {
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
.remove-button {
    background: $light-grey;
    color: $black;
    font-size: 14px;
    padding: 5px 15px;
    margin-top: 50px;
    transition: all 0.4s;
    &:hover {
        background: $black;
        color: $light-grey;
    }

    &.loading {
        pointer-events: none;
    }
}
</style>
