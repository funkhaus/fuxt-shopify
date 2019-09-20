<template>
    <main class="shop-detail">
        <!-- <site-breadcrumbs
            title="Shop"
            link="shop"
        /> -->

        <loading-icon v-if="$apollo.loading" />

        <div class="product-detail">
            <!-- <product-image-slideshow
                v-if="theImages.length >= 2"
                :images="theImages"
            />

            <product-image-single
                v-else-if="theImages.length == 1"
                :image="theImages[0]"
            />

            <product-image-single v-else /> -->
            <product-image-single :image="theImages[0]" />

            <div class="product-meta">
                <!--
                Hide until more collections exist
                <h2
                    class="product-collection"
                    v-html="`${theCollection.title} collection`"
                />
                -->
                <h2
                    class="product-title"
                    v-html="theProductTitle"
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

                <!-- <product-social-share
                    :share-text="theProductDescription"
                    :title="theProductTitle"
                /> -->
            </div>
        </div>

        <!-- <shop-related-products
            v-if="product"
            :collection-handle="theCollection.handle"
            :exclude-handle="theProductHandle"
        /> -->

        <shop-error-message
            v-if="!product"
            type="product"
        />

        <!-- <site-footer /> -->
    </main>
</template>

<script>
import _get from "lodash/get"
import { ProductByHandle } from "~/queries/Shopify.gql"


import shopRelatedProducts from "~/components/shop/RelatedProducts"
import shopErrorMessage from "~/components/shop/ErrorMessage"
// import productSocialShare from "~/components/product/productSocialShare"
import productAddToCartButton from "~/components/product/AddToCartButton"
import productSelectQuantity from "~/components/product/SelectQuantity"
import productSelectVariant from "~/components/product/SelectVariant"
import productPrice from "~/components/product/Price"
import productImageSingle from "~/components/product/ImageSingle"

export default {
    components: {
        shopRelatedProducts,
        shopErrorMessage,
        // productSocialShare,
        productAddToCartButton,
        productSelectQuantity,
        productSelectVariant,
        productPrice,
        productImageSingle,
        
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
    head() {
        return {
            title: this.theProductTitle,
            meta: [
                {
                    hid: "description",
                    name: "description",
                    property: "og:description",
                    content: _get(this, "theProductDescriptionSeo", "")
                },
                {
                    hid: "og:image",
                    property: "og:image",
                    content: _get(this, "theFeaturedImageSeo", "")
                }
            ]
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
        theFeaturedImageSeo() {
            return _get(this, "theImages[0].src", "")
        },
        theProductDescription() {
            return _get(this, "product.descriptionHtml", "")
        },
        theProductDescriptionSeo() {
            return (
                _get(this, "theProductDescription", "").replace(
                    /<[^>]*>?/gm,
                    ""
                ) || ""
            )
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
    mounted() {
        // this.$store.commit("site/SET_COLOR_THEME", "light-theme")
    },
    beforeDestroy() {
        // this.$store.commit("site/SET_COLOR_THEME", "dark-theme")
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

    .field-title {
        font-size: 14px;
        font-weight: 400;
        color: $grey;
        text-transform: uppercase;
        display: inline-block;
        margin: 10px 0;
        user-select: none;
    }

    .product-detail {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-content: center;
        align-items: center;

        @include cinema-width;
        margin: var(--xlarge-gutter) auto var(--medium-gutter) auto;
        padding: 0 var(--medium-gutter);
    }
    .product-image-single,
    .product-image-slideshow {
        width: 50%;
    }

    .product-meta {
        width: 50%;
        padding: var(--small-gutter) var(--medium-gutter);
        box-sizing: border-box;

        .product-collection,
        .product-title {
            font-size: 28px;
            margin: 0;
            text-transform: capitalize;
            font-weight: 300;
        }

        .product-select-quantity {
            .count {
                min-width: 15px;
                text-align: center;
            }
            .decrement svg {
                margin-top: -4px;
            }
            .increment svg {
                margin-top: -5px;
            }
        }

        .add-to-cart,
        .product-select-size {
            display: inline;
        }

        .product-details,
        .product-description {
            line-height: 1.5;

            ul {
                padding: 0;
                margin-top: 0;
                list-style-type: none;
                li:before {
                    content: "\2014  ";
                }
            }
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        .field-title {
            font-size: 18px;
        }

        .product-detail {
            margin-bottom: var(--xlarge-gutter);
        }

        .product-meta {
            .product-collection,
            .product-title {
                font-size: 38px;
            }
            .product-details,
            .product-description {
                font-size: 20px;
            }
            .price {
                font-size: 22px;
            }
        }
    }

    @media #{$lt-tablet} {
        .product-detail {
            margin: var(--large-gutter) auto;
            flex-direction: column;
        }

        .product-image-slideshow,
        .product-meta {
            width: 100%;
            margin: var(--medium-gutter) 0;
        }

        .product-meta {
            padding: var(--medium-gutter) 0;
            .product-description.entry > p {
                max-width: 100%;
            }
        }
    }
}
</style>
