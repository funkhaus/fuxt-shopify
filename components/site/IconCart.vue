<template>
    <div :class="classes">
        <client-only>
            <nuxt-link to="/cart">
                <svg-icon-shopping-cart class="svg" />

                <div
                    v-if="totalProducts() > 0"
                    class="cart-items"
                >
                    <span class="item-count">{{ totalProducts() }}</span>
                </div>
            </nuxt-link>
        </client-only>
    </div>
</template>

<script>
import _get from "lodash/get"

export default {
    computed: {
        classes() {
            return [
                "icon-cart",
                { long: this.totalProducts() >= 10 ? true : false }
            ]
        },
        display() {
            if (this.$route.name == "index") {
                return false
            }
            if (this.totalProducts() < 1) {
                return false
            }
            return true
        }
    },
    watch: {
        "$store.state.shop.cart.count"(newVal, oldVal) {
            console.log("count icon count update")
            this.totalProducts()
        }
    },
    methods: {
        totalProducts() {
            return _get(this, "$store.state.shop.cart.count", 0)
        }
    }
}
</script>

<style lang="scss">
.icon-cart {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 20px;
    transition: all 0.4s ease-in-out;

    .cart-items {
        position: absolute;
        top: -5px;
        right: 15px;

        width: 16px;
        height: 16px;
        background-color: $blue;
        border-radius: 50%;
        .item-count {
            color: $white;
            text-align: center;
            font-size: 11px;
            font-weight: 600;

            position: absolute;
            top: 2px;
            right: 5px;
        }
    }
    &.long .cart-items .item-count {
        right: 2.5px;
        top: 2px;
    }

    .svg * {
        transition: all 0.4s;
        fill: $black;
    }
    // Menu State
    .menu-opened & {
        opacity: 0;
        pointer-events: none;
    }
    // Light theme
    .light-theme & {
        .svg * {
            fill: $black;
        }
    }
    // Scroll State
    // .is-scrolled & {
    //     .svg * {
    //         fill: $white;
    //     }
    // }
}
</style>
