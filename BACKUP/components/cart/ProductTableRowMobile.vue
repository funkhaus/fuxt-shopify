<template>
    <tbody>
        <tr
            v-for="(product, i) in products"
            :key="i"
            class="cart-row border"
        >
            <td class="cart-product-wrapper">
                <nuxt-link :to="`/shop/${product.variant.product.handle}`">
                    <img
                        class="product-image"
                        :src="product.variant.image.src"
                        :alt="product.title"
                    >

                    <div class="product-meta">
                        <div class="cart-product-title">
                            {{ product.title }}
                        </div>

                        <div class="variant-meta">
                            Size: {{ product.variant.title }}
                        </div>
                        <div
                            v-if="product.quantity > 1"
                            class="multiple"
                        >
                            ( X {{ product.quantity }} )
                        </div>

                        <cart-remove-item-button :product-id="product.id" />
                    </div>
                </nuxt-link>
            </td>

            <td class="cart-price-wrapper">
                {{ product.variant.priceV2.amount | money }}

                <div class="cart-quantity">
                    <cart-select-quantity
                        :quantity="product.quantity"
                        :variant-id="product.variant.id"
                    />
                </div>
            </td>
        </tr>
    </tbody>
</template>

<script>
export default {
    props: {
        products: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss">
.cart-product-table {
    &.mobile {
        thead th {
            text-align: left;
            &:last-child {
                text-align: right;
            }
        }
        table tr {
            border-bottom: 1px solid $black;
            &:first-child {
                border-top: 1px solid $black;
            }
        }

        .cart-price-wrapper {
            text-align: right;
            height: 100%;
        }

        .cart-quantity {
            margin: 20px 0;
        }
    }
}
</style>
