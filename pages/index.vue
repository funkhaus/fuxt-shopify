<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        :class="classes"
    >
        <p>
            This page queries all products in the "frontpage" collection
        </p>

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
        />
    </section>
</template>

<script>
// Helpers
import _get from "lodash/get"

// Queries
import { Collections, CollectionByHandle } from "~/queries/Shopify.gql"

// Components
import blockProduct from "~/components/block/Product"

export default {
    transition: "fade",
    components: {
        blockProduct
    },
    computed: {
        classes() {
            return ["section", "section-home"]
        },
        collectionImage() {
            return _get(this, "collection.image", {})
        },
        products() {
            let products = _get(this, "collection.products.edges", [])
            return products.map(product => product.node)
        }
    },
    apollo: {
        collection: {
            client: "shopify",
            query: CollectionByHandle,
            variables() {
                return {
                    handle: "frontpage"
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
.section-home {
    color: $black;
    margin: 0 auto;
    padding: 100px 0;
    text-align: center;

    // Breakpoints
    // @media #{$lt-tablet} {
    // }
}
</style>
