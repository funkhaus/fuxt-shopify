<template>
    <div class="cart-bottom-panel">
        <div class="cart-total">
            <span>Total</span>
            <span>{{ cartTotal | money }}</span>
        </div>
        <p class="shipping-info">
            Shipping and taxes calculated at checkout
        </p>

        <div class="cart-buttons">
            <nuxt-link to="/shop">
                Continue Shopping
            </nuxt-link>
            <a
                :href="cartUrl"
                target="_blank"
                class="checkout"
            >
                Checkout
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        products: {
            type: Array,
            default: () => []
        },
        cartUrl: {
            type: String,
            default: ""
        }
    },
    computed: {
        cartTotal() {
            let sum = 0
            for (let i = 0; i < this.products.length; i++) {
                sum +=
                    this.products[i].variant.priceV2.amount *
                    this.products[i].quantity
            }
            return sum
        }
    }
}
</script>

<style lang="scss">
.cart-bottom-panel {
    margin: 40px 0;
    font-size: 16px;
    text-align: right;

    .shipping-info {
        font-weight: 400;
        font-style: italic;
    }
    .cart-total span:first-child {
        margin-right: 200px;
    }
    .cart-buttons a,
    .cart-buttons button {
        font-size: 16px;
        color: $grey;
        text-transform: uppercase;
        margin: 10px 20px;
        transition: all 0.2s;
        position: relative;
        padding: 0;
        &:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -3px;
            height: 2px;
            background-color: $black;
            width: 0;
            transition: width 0.25s;
        }
    }
    a.checkout {
        color: $black;
        margin-right: 0;
        cursor: pointer;
    }
    // Hovers
    @media (hover: hover) {
        .cart-buttons a:hover:after,
        .cart-buttons button:hover:after {
            width: 100%;
        }
    }

    // Breakpoints
    @media #{$lt-phone} {
        text-align: center;
        .cart-buttons a,
        .cart-buttons button {
            display: block;
        }
        a.checkout {
            color: $black;
            margin: 20px;
        }
    }
}
</style>
