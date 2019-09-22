<template>
    <div :class="classes">
        <client-only>
            <nuxt-link :to="to">
                <slot>Cart:</slot>

                <span class="count">
                    {{ $store.state.shopify.cart.count }}
                </span>

                <span class="price">
                    {{ $store.getters["shopify/cartSubTotal"] }}
                </span>
            </nuxt-link>
        </client-only>
    </div>
</template>

<script>
import _get from "lodash/get"

export default {
    props: {
        to: {
            type: String,
            default: "/cart"
        }
    },
    computed: {
        classes() {
            return [
                "shopify-mini-cart",
                { "is-empty": !this.$store.state.shopify.cart.count }
            ]
        }
    }
}
</script>

<style lang="scss">
.shopify-mini-cart {
}
</style>
