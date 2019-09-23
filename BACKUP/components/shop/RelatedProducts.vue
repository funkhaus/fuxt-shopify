<template>
    <div class="shop-related-products">
        <site-section-title :title="title" />
        <client-only>
            <div
                v-if="showSlideshow"
                v-swiper:relatedProducts="relatedProductSwiperOptions"
                @resize="updateSlideshow()"
            >
                <div class="swiper-wrapper">
                    <div
                        v-for="(block, i) in shuffledProducts"
                        :key="i"
                        class="swiper-slide"
                    >
                        <block-product
                            v-in-view
                            :src="block.images"
                            :title="block.title"
                            :price="block.priceRange.minVariantPrice.amount"
                            :url="block.handle"
                            :description="block.description"
                            :available="block.availableForSale"
                            :style="inlineTransitionStyles(i)"
                        />
                    </div>
                </div>
            </div>
        </client-only>

        <svg-icon-minus
            v-if="filteredProducts"
            slot="button-prev"
            class="swiper-button-prev"
        />
        <svg-icon-plus
            v-if="filteredProducts"
            slot="button-next"
            class="swiper-button-next"
        />
    </div>
</template>

<script>
import _get from "lodash/get"
import _shuffle from "lodash/shuffle"
import { CollectionByHandle } from "~/gql/queries/Shopify.gql"

export default {
    props: {
        title: {
            type: String,
            default: "Other Items"
        },
        collectionHandle: {
            type: String,
            default: "frontpage"
        },
        excludeHandle: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            showSlideshow: false,
            relatedProductSwiperOptions: {
                loop: true,
                slidesPerView: this.slidesPerView(),
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }
            }
        }
    },
    computed: {
        filteredProducts() {
            let preFiltered = _get(this, "collection.products.edges", [])
            let products = preFiltered.map(product => product.node)

            if (this.excludeHandle !== "") {
                console.log("excludding", this.excludeHandle)
                return products.filter(
                    // exclude prod by handles
                    prod => prod.handle != this.excludeHandle
                )
            } else {
                return products
            }
        },
        shuffledProducts() {
            return _shuffle(this.filteredProducts)
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.showSlideshow = true
        })
    },
    methods: {
        slidesPerView() {
            switch (this.$store.state.breakpoint) {
                case "mobile":
                    return 1
                case "tablet":
                    return 3
                default:
                    return 4
            }
        },
        updateSlideshow() {
            this.relatedProducts.params.slidesPerView = this.slidesPerView()
        },

        inlineTransitionStyles(i) {
            return [{ "transition-delay": `${i * 200}ms` }]
        }
    },
    apollo: {
        collection: {
            client: "shopify",
            query: CollectionByHandle,
            variables() {
                return {
                    handle: this.collectionHandle
                }
            },
            update(data) {
                return _get(data, "collectionByHandle", {})
            }
        }
    }
}
</script>

<style lang="scss">
.shop-related-products {
    @include cinema-width;
    margin-top: var(--medium-gutter);
    margin-bottom: var(--medium-gutter);
    padding: 0 40px;
    box-sizing: border-box;
    position: relative;
    text-align: center;

    .section-title {
        margin: 0 0 20px 0;
        line-height: 1;
    }

    .block-product {
        padding: 0 10px 10px;
        margin: 0 1px;
        display: block;

        .meta {
            margin: 0 10px;
        }
    }

    // Navigation
    .swiper-button-next,
    .swiper-button-prev {
        // override
        position: absolute;
        margin-top: 0;
        background-image: none;
        height: 100%;
        top: 0;
        width: 15px;
        z-index: 20;
        transition: all 0.4s ease-in-out;
        &:focus {
            outline: none;
        }
    }
    .swiper-button-prev {
        left: 15px;
    }
    .swiper-button-next {
        right: 15px;
    }

    // Hovers
    @media (hover: hover) {
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
            transform: scale(0.9);
        }
    }

    // Breakpoints
    @media #{$lt-tablet} {
    }
}
</style>
