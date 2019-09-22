<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        class="product-detail"
    >
        <shopify-add-to-cart
            variant-id="Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDExODIzMTgwMTkwOQ=="
        />

        <!-- <update-quantity
            variant-id="Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDExODIzMTgwMTkwOQ=="
            :quantity="0"
        />

        <button @click="getCheckout">
            Get checkout
        </button> -->
    </section>
</template>

<script>
// Helpers
import _get from "lodash/get"

// Queries
import { ProductByHandle } from "~/gql/queries/Shopify.gql"

// Components
import shopifyAddToCart from "~/components/shopify/AddToCart"

export default {
    components: {
        shopifyAddToCart
    },
    transition: "fade",
    computed: {},
    apollo: {
        product: {
            client: "shopify",
            query: ProductByHandle,
            variables() {
                return {
                    handle: this.$route.params.product
                }
            },
            update(data) {
                return _get(data, "productByHandle", {})
            }
        }
    }
}
</script>

<style lang="scss">
.product-detail {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;

    button {
        margin-top: 100px;
    }

    .product-images {
        width: 300px;
        margin-right: 20px;

        > .image {
            border: 2px solid black;
            width: 100%;
            box-sizing: border-box;
            margin: 20px 0;
        }
    }
}
</style>
