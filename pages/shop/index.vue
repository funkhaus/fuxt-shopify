<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        :class="classes"
    >
        <p>
            This page queries all products in the "frontpage" collection. Better
            to call this "featured" so URL looks better.
        </p>

        <shopify-block-product
            v-for="(block, i) in products"
            :key="i"
            :images="block.images"
            :title="block.title"
            :price="block.priceRange.minVariantPrice"
            :to="`/shop/${collectionHandle}/products/${block.handle}`"
            :description="block.description"
            :is-available="block.availableForSale"
        />
    </section>
</template>

<script>
// Helpers
import _get from "lodash/get"

// Queries
import { CollectionByHandle } from "~/gql/queries/Shopify.gql"

// Components
import shopifyBlockProduct from "~/components/shopify/BlockProduct"

export default {
    transition: "fade",
    components: {
        shopifyBlockProduct
    },
    data() {
        return {
            collectionHandle: "frontpage"
        }
    },
    computed: {
        classes() {
            return ["section", "section-home"]
        },
        products() {
            let products = _get(this, "collection.products.edges", [])
            return products.map(product => product.node)
        }
    },
    mounted() {
        // TODO Fire off a this.gtag() for the view_item_list of all products
        // SEE https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce
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
.section-home {
    margin: 0 auto;
    padding: 100px 0;
    text-align: center;
}
</style>
