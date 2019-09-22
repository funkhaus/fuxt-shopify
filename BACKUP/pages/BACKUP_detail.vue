<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        class="shop-detail"
    >
        <shop-error-message
            v-if="!product"
            type="product"
        />

        <div class="product-images">
            <img
                v-for="(image, i) in theImages"
                v-if="image.src"
                :key="i"
                class="image"
                :src="image.src"
                :alt="image.altText"
            >
        </div>

        <div class="product-meta">
            <h2
                class="product-title"
                v-html="theProductTitle"
            />

            <nuxt-link
                class="product-collection"
                :to="`/shop/collections/${theCollection.handle}`"
                v-html="theCollection.title"
            />

            <product-price
                :price="thePrice"
                :selected-variant="selectedVariant"
            />

            <wp-content
                class="product-description entry"
                v-html="theProductDescription"
            />

            <product-select-variant
                v-if="theAvailability"
                :error="selectedVariantError"
                variant-title="size"
                :variants="theVariants"
                @select-variant="variantHandler"
            >
                <svg-chevron-right class="svg" />
            </product-select-variant>

            <product-select-quantity
                v-if="theAvailability"
                :product-quantity="quantity"
                @select-quantity="quantityHandler"
            >
                <svg-icon-minus
                    slot="decrement"
                    class="svg"
                />
                <svg-icon-plus
                    slot="increment"
                    class="svg"
                />
            </product-select-quantity>

            <product-add-to-cart-button
                :available="theAvailability"
                :selected-variant="selectedVariant"
                :quantity="quantity"
                @add-to-cart-error="addToCartErrorHandler"
                @add-to-cart-success="addToCartHandler"
            >
                <svg-icon-plus
                    name="button-icon"
                    class="svg"
                />
                <span
                    class="available"
                    v-text="'To Cart'"
                />
            </product-add-to-cart-button>
        </div>
    </section>
</template>

<script>
// Helpers
import _get from "lodash/get"

// Queries
import { ProductByHandle } from "~/gql/queries/Shopify.gql"

// Components
import shopErrorMessage from "~/components/shop/ErrorMessage"
import productSelectQuantity from "~/components/product/SelectQuantity"
import productSelectVariant from "~/components/product/SelectVariant"
import productPrice from "~/components/product/Price"
import productAddToCartButton from "~/components/product/AddToCartButton"

export default {
    components: {
        shopErrorMessage,
        productSelectQuantity,
        productSelectVariant,
        productPrice,
        productAddToCartButton
    },
    transition: "fade",
    data() {
        return {
            quantity: 1,
            selectedVariant: {},
            selectedVariantError: false,
            selectedProduct: {},
            cartUpdateError: false,
            mutationError: false
        }
    },
    computed: {
        theProductTitle() {
            return _get(this, "product.title", "")
        },
        theProductHandle() {
            return this.$route.params.detail
        },
        thePrice() {
            let price = _get(
                this,
                "product.priceRange.maxVariantPrice.amount",
                ""
            )
            if (this.selectedVariant.price) {
                price = this.selectedVariant.price
            }
            return price
        },
        theAvailability() {
            return _get(this, "product.availableForSale", true)
        },
        theImages() {
            let images = _get(this, "product.images.edges", [])
            if (images) {
                return images.map(image => image.node)
            }
        },
        theProductDescription() {
            return _get(this, "product.descriptionHtml", "")
        },
        theCollection() {
            return {
                title: _get(
                    this,
                    "product.collections.edges[0].node.title",
                    ""
                ),
                handle: _get(
                    this,
                    "product.collections.edges[0].node.handle",
                    ""
                )
            }
        },
        theVariants() {
            let variants = _get(this, "product.variants.edges", [])
            if (variants) {
                return variants.map(variant => variant.node)
            }
        }
    },
    methods: {
        addToCartErrorHandler() {
            this.selectedVariantError = true
            this.cartUpdateError = true
        },
        // TODO: SHOP: move to error handling only to components?
        variantHandler(selectedVariant) {
            console.log("selectedVariant ", selectedVariant)
            if (!selectedVariant.id) {
                console.log("selectedVariantError!")
                this.selectedVariantError = true
            }

            this.selectedVariantError = false
            this.selectedVariant = selectedVariant
            console.log("this.selectedVariant ", this.selectedVariant)
        },
        addToCartHandler(selectedProduct) {
            console.log("selectedProduct ", selectedProduct)
            // Reset quantity to 1 on success
            this.quantity = 1
        },
        quantityHandler(quantity) {
            this.quantity = quantity
        }
    },
    apollo: {
        product: {
            client: "shopify",
            query: ProductByHandle,
            variables() {
                return {
                    handle: this.theProductHandle
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
.shop-detail {
    background-color: $white;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;

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
