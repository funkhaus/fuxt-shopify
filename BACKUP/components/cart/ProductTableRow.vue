<template>
    <tbody>
        <tr
            v-for="(product, i) in products"
            :key="product.variant.id"
            class="cart-row border"
        >
            <td class="cart-product-wrapper">
                <nuxt-link :to="`/shop/${product.variant.product.handle}`">
                    <img
                        class="product-image"
                        :src="product.variant.image.src"
                        :alt="product.title"
                    >
                </nuxt-link>

                <div class="product-meta">
                    <div class="cart-product-title">
                        {{ product.title }}
                    </div>

                    <div class="variant-meta">
                        Size: {{ product.variant.title }}
                    </div>
                    <cart-remove-item-button :product-id="product.id" />
                </div>
            </td>

            <td class="cart-price-wrapper">
                <!-- TODO: CART: discount_allocations -->
                {{ product.variant.priceV2.amount | money }}
            </td>

            <td class="cart-quantity">
                <cart-select-quantity
                    :quantity="product.quantity"
                    :variant-id="product.variant.id"
                />
            </td>

            <td class="cart-total">
                <!-- TODO: CART:  original_line_price; sale_price; final_line_price -->
                {{
                    productTotal(
                        product.variant.priceV2.amount,
                        product.quantity
                    ) | money
                }}
            </td>
        </tr>
    </tbody>
</template>

<script>
import cartRemoveItemButton from "~/components/cart/RemoveItemButton"
import cartSelectQuantity from "~/components/cart/SelectQuantity"

export default {
    components: {
        cartRemoveItemButton,
        cartSelectQuantity
    },
    props: {
        products: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        productTotal(price, quantity) {
            return price * quantity
        }
    }
}
</script>

<style lang="scss">
.cart-product-table {
    .cart-product-wrapper {
        width: 500px;
        .product-image {
            max-width: 200px;
            height: auto;
            vertical-align: middle;
            padding: 10px 0;
            box-sizing: border-box;
        }
        .product-meta {
            display: inline-block;
            vertical-align: middle;
            padding: 20px;
        }
    }

    .cart-price-wrapper {
        text-align: center;
    }
    .cart-quantity {
        text-align: center;
    }
    .cart-total {
        text-align: right;
    }
}
</style>
