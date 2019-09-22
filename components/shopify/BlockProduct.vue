<template>
    <nuxt-link
        :class="classes"
        :to="to"
    >
        <responsive-image
            v-if="imageSrc"
            class="image"
            :src="imageSrc"
            :alt="imageAlt"
            :aspect-ratio="100"
            object-fit="contain"
        >
            <slot
                v-if="!isAvailable"
                name="not-available"
                class="not-available"
            >
                Sold Out
            </slot>
        </responsive-image>

        <div class="meta">
            <h3
                class="title"
                v-html="title"
            />
            <div
                v-if="description"
                class="description"
                v-html="description"
            />

            <div
                v-if="formattedPrice"
                class="price"
                v-text="formattedPrice"
            />
        </div>
    </nuxt-link>
</template>

<script>
// Helpers
import _get from "lodash/get"
import { formatMoney } from "~/utils/Shopify.js"

export default {
    props: {
        to: {
            type: String,
            default: ""
        },
        images: {
            type: Object,
            default: () => {}
        },
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        price: {
            type: Object,
            default: () => {}
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        classes() {
            return [
                "shopify-block-product",
                { "not-unavailable": !this.isAvailable }
            ]
        },
        imageSrc() {
            return _get(this, "images.edges[0].node.transformedSrc", "")
        },
        imageAlt() {
            return _get(this, "images.edges[0].node.altText", "")
        },
        formattedPrice() {
            let output = ""
            if (this.price.amount) {
                output = formatMoney(this.price.amount, this.price.currencyCode)
            }
            return output
        }
    }
}
</script>

<style lang="scss">
.shopify-block-product {
    display: inline-block;
    width: 200px;
}
</style>
