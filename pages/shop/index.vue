<!-- QUESTION: Is it possible to use _shop-collecitons? Yes but it cant be same name as path-->
<template>
    <site-loading v-if="$apollo.loading" />

    <section
        v-else
        :class="classes"
    >
        <!-- NOTE: Disabled on shop homepage per request -->
        <!-- <shop-collection-menu :collections="collectionTitles" /> -->

        <grid-collection :products="filteredProducts" />

        <!-- <site-footer /> -->
    </section>
</template>

<script>
import _get from "lodash/get"

import gridCollection from "~/components/grid/Collection"

import { Collections, CollectionByHandle } from "~/queries/ShopifyQuery.gql"

export default {
    components: {
        gridCollection
    },
    transition: "fade",
    head() {
        return {
            title: _get(this, "page.title", ""),
            meta: [
                {
                    hid: "description",
                    name: "description",
                    property: "og:description",
                    content: _get(this, "page.excerpt", "")
                }
            ]
        }
    },
    computed: {
        classes() {
            return ["section", "page-shop"]
        },
        collectionHandle() {
            return _get(
                this,
                "page.acfShopifyMeta.collectionHandle",
                "frontpage"
            )
        },
        collectionImage() {
            return _get(this, "collection.image", {})
        },
        filteredProducts() {
            let products = _get(this, "collection.products.edges", [])

            return products.map(product => product.node)
        },
        collectionTitles() {
            return this.collections.map(collection => collection.node)
        }
    },
    apollo: {
        collections: {
            client: "shopify",
            query: Collections,
            update(data) {
                return _get(data, "collections.edges", {})
            }
        },
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
.page-shop {
    background: $white;

    .grid-collection {
        margin-top: 20px;
    }
}
</style>
