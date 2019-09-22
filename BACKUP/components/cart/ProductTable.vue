<template>
    <div
        v-if="!isMobile()"
        class="cart-product-table desktop"
    >
        <table>
            <thead class="cart-row">
                <th scope="col">
                    Product
                </th>
                <th
                    class="text-right"
                    scope="col"
                >
                    Price
                </th>
                <th
                    class="text-center"
                    scope="col"
                >
                    Quantity
                </th>
                <th
                    class="text-right"
                    scope="col"
                >
                    Total
                </th>
            </thead>

            <cart-product-table-row :products="products" />
        </table>
    </div>

    <div
        v-else-if="isMobile()"
        class="cart-product-table mobile"
    >
        <table>
            <thead class="cart-row">
                <th scope="col">
                    Product
                </th>
                <th
                    class="text-right"
                    scope="col"
                >
                    Price
                </th>
            </thead>

            <cart-product-table-row-mobile :products="products" />
        </table>
    </div>
</template>

<script>
import cartProductTableRow from "~/components/cart/ProductTableRow"
import cartProductTableRowMobile from "~/components/cart/ProductTableRowMobile"

export default {
    components: {
        cartProductTableRow,
        cartProductTableRowMobile
    },
    props: {
        products: {
            type: Array,
            default: () => []
        }
    },
    computed: {},
    methods: {
        productTotal(price, quantity) {
            return price * quantity
        },
        isMobile() {
            return this.$store.getters.isMobile
        }
    }
}
</script>

<style lang="scss">
.cart-product-table {
    thead th {
        font-weight: 400;
        padding: 10px 0;
        &:last-child {
            text-align: right;
        }
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 16px;
        tr {
            &:first-child {
                border-top: 1px solid $black;
            }
            border-bottom: 1px solid $black;
        }
    }
}
</style>
