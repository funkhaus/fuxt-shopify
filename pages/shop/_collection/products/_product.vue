<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        class="product-detail"
    >
        <div class="images">
            <img
                v-for="(image, i) in images"
                v-if="image.transformedSrc"
                :key="i"
                class="image"
                :src="image.transformedSrc"
                :alt="image.altText"
            >
        </div>

        <div class="content">
            <h2
                class="title"
                v-html="product.title"
            />

            <shopify-price
                :price-range="product.priceRange"
                :variant-price="selectedVariant.priceV2"
                :variant-sale-price="selectedVariant.compareAtPriceV2"
            />

            <shopify-select-variant
                :variants="variants"
                :select-first="false"
                @selected-variant="setVariant"
            />

            <shopify-select-quantity @selected-quantity="setQuantity" />

            <shopify-add-to-cart
                :is-available="selectedVariant.availableForSale"
                :variant-id="selectedVariant.id"
                :variant-title="selectedVariant.title"
                :product-title="product.title"
                list-name="Product detail page"
                :vendor="product.vendor"
                :collection="$route.params.collection"
                :quantity="selectedQuantity"
                :price="selectedVariant.price"
            />

            <div
                class="description"
                v-html="product.descriptionHtml"
            />
        </div>
    </section>
</template>

<script>
// Helpers
import _get from "lodash/get"

// Queries
import { ProductByHandle } from "~/gql/queries/Shopify.gql"

// Components
import shopifyPrice from "~/components/shopify/Price"
import shopifyAddToCart from "~/components/shopify/AddToCart"
import shopifySelectVariant from "~/components/shopify/SelectVariant"
import shopifySelectQuantity from "~/components/shopify/SelectQuantity"

export default {
    components: {
        shopifySelectVariant,
        shopifySelectQuantity,
        shopifyAddToCart,
        shopifyPrice
    },
    transition: "fade",
    data() {
        return {
            selectedVariant: {},
            selectedQuantity: 1
        }
    },
    computed: {
        images() {
            let images = _get(this, "product.images.edges", [])
            if (images) {
                return images.map(image => image.node)
            }
        },
        variants() {
            return _get(this, "product.variants.edges", [])
        }
    },
    methods: {
        setVariant(variant) {
            this.selectedVariant = variant
        },
        setQuantity(quantity) {
            this.selectedQuantity = Number(quantity)
        }
    },
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

    fieldset,
    button {
        margin: 10px 0;
    }

    .images {
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
