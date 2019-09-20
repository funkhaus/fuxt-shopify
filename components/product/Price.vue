<template>
    <div :class="classes">
        <span
            v-if="compareAtPrice"
            class="compare-at-price"
        >
            {{ compareAtPrice | money }}
        </span>
        <span class="price">
            {{ price | money }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        price: {
            type: String,
            default: "0"
        },
        selectedVariant: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        classes() {
            return [
                "product-price",
                { "has-compare-at-price": this.compareAtPrice }
            ]
        },
        compareAtPrice() {
            return this.selectedVariant.compareAtPrice
                ? this.selectedVariant.compareAtPrice
                : false
        }
    }
}
</script>

<style lang="scss">
.product-price {
    span {
        margin: 10px 0;
        display: inline-block;
        font-size: 16px;
        font-weight: 300;
    }
    &.has-compare-at-price {
        .compare-at-price {
            text-decoration: line-through;
            color: $grey;
        }
    }
}
</style>
