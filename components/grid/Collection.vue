<template>
    <div class="grid-collection">
        <block-product
            v-for="(block, i) in products"
            v-if="products"
            :key="i"
            :src="block.images"
            :title="block.title"
            :price="block.priceRange.minVariantPrice.amount"
            :url="block.handle"
            :description="block.description"
            :available="block.availableForSale"
            :style="inlineTransitionStyles(i)"
        />
    </div>
</template>

<script>
import blockProduct from "~/components/block/Product"
// import inView from "~/components/inView"

export default {
    components: {
        blockProduct
        // inView
    },
    props: {
        name: {
            type: String,
            default: ""
        },
        products: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        inlineTransitionStyles(i) {
            return [{ "transition-delay": `${i * 200}ms` }]
        }
    }
}
</script>

<style lang="scss">
.grid-collection {
    @include cinema-width;
    margin: var(--small-gutter) auto var(--medium-gutter) auto;
    padding: 0 var(--medium-gutter);
    text-align: center;
    .block-product {
        width: 25%;
        padding: 0 10px 10px;
        margin-bottom: 20px;

        // in-view styles
        // transition: all 1s;
        // opacity: 0;
        // transform: translateY(10%);
        // &.in-view {
        //     opacity: 1;
        //     transform: translateY(0%);
        // }

        .meta {
            .title {
                font-size: 16px;
            }
            .description {
                font-size: 14px;
            }
        }
    }

    @media #{$gt-cinema} {
        max-width: 2400px;
        margin-left: auto;
        margin-right: auto;

        .block-product {
            width: 20%;

            .meta {
                .title {
                    font-size: 22px;
                }
                .description {
                    font-size: 18px;
                }
                .price {
                    top: 4px;
                }
            }
        }
    }
    @media #{$lt-tablet} {
        text-align: left;
        .block-product {
            width: 33.33%;
        }
    }
    @media #{$lt-phone} {
        .block-product {
            width: 100%;
        }
    }
}
</style>
