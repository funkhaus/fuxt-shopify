<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        :class="classes"
    >
        <!-- <site-breadcrumbs
            title="shop"
            link="shop"
        /> -->

        <div class="content">
            <!-- <site-section-title
                title="Your Cart"
                align="left"
            /> -->

            <div
                v-if="lineItems.length == 0"
                class="empty-message"
            >
                <span>Your cart is empty</span>
                <nuxt-link to="/shop">
                    Continue to store
                </nuxt-link>
            </div>

            <cart-product-table
                v-if="lineItems.length > 0"
                :products="lineItems"
            />

            <cart-bottom-panel
                :products="lineItems"
                :cart-url="checkout.webUrl"
            />
        </div>

        <!-- <site-footer /> -->
    </section>
</template>

<script>
// Helpers
import _get from "lodash/get"
import gql from "graphql-tag"

// Components
import cartProductTable from "~/components/cart/ProductTable"
import cartBottomPanel from "~/components/cart/BottomPanel"

export default {
    components: {
        cartProductTable,
        cartBottomPanel
    },
    data() {
        return {
            mutationError: false
        }
    },
    transition: "fade",
    head() {
        return {
            title: "Cart",
            meta: [
                {
                    hid: "description",
                    name: "description",
                    property: "og:description",
                    content: "Wolf Entertainment Cart"
                }
            ]
        }
    },
    computed: {
        classes() {
            return ["section", "page-cart"]
        },
        checkout() {
            return _get(this, "$store.state.shop.checkout", {})
        },
        lineItems() {
            return _get(this, "$store.state.shop.cart.products", [])
        }
    },
    mounted() {
        this.$Shopify.init()
    },

    methods: {
        isMobile() {
            switch (this.$store.state.breakpoint) {
                case "mobile":
                    return true
                default:
                    return false
            }
        }
    }
}
</script>

<style lang="scss">
.page-cart {
    position: relative;

    .content {
        @include cinema-width;
        padding: 0 var(--large-gutter);
        margin: 150px auto var(--large-gutter) auto;
        min-height: 50vh;
    }

    .section-title {
        text-transform: capitalize;
        font-size: 36px;
    }

    .empty-message {
        font-size: 36px;
        text-align: center;
        span {
            display: block;
        }
        a {
            display: block;
            text-decoration: underline;
            font-size: 24px;
            font-weight: 300;
        }
    }

    // Breakpoints
    @media #{$lt-tablet} {
        .content {
            padding: 0 20px;
        }

        .empty-message {
            margin: 60px 0;
        }
    }
}
</style>
