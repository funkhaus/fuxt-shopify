<template>
    <div class="add-to-cart-button">
        <button
            :class="{ loading }"
            @click="addToCart()"
        >
            <slot
                v-if="available"
                name="button-icon"
            />

            <slot v-if="available" />

            <span
                v-else-if="!available"
                class="sold-out"
                v-text="'Sold Out'"
            />
        </button>
    </div>
</template>

<script>
import Vue from "vue"

export default {
    props: {
        available: {
            type: Boolean,
            default: true
        },
        selectedVariant: {
            type: Object,
            default: () => {}
        },
        quantity: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async addToCart() {
            // Must select variant
            console.log("selectedVariant ", this.selectedVariant)
            if (!this.selectedVariant.id) {
                console.log("Error, invalid variant id", this.selectedVariant)
                this.$emit("add-to-cart-error")
                return false
            }
            // set variant
            let selectedProduct = {
                variantId: this.selectedVariant.id,
                quantity: this.quantity
            }
            // Create / update checkout
            if (selectedProduct.variantId) {
                console.log("addToCart: ", this.selectedVariant)

                console.log("clicked", this.$Shopify.loading)

                await this.$Shopify.addToCart(selectedProduct)

                console.log("added to cart", this.$Shopify.loading)

                this.$emit("add-to-cart-success", selectedProduct)

                // Vue.toasted.show("Product added to cart!", {
                //     theme: "toasted-primary",
                //     position: "top-right",
                //     duration: 2000,
                //     icon: false,
                //     onClick: (e, toast) => {
                //         toast.goAway(0)
                //     }
                // })

                return true
            }
        }
    }
}
</script>

<style lang="scss">
.add-to-cart-button {
    display: inline-block;

    button {
        padding: 20px;
        padding-left: 0;

        font-size: 16px;
        text-transform: uppercase;
        vertical-align: top;
        font-weight: 400;
    }
    .loading {
        background-color: $grey;
        pointer-events: none;
    }
    .available {
        display: inline-block;
        transition: all 0.4s;
    }
    .svg {
        padding-right: 5px;
        transition: all 0.4s;
    }
    .sold-out {
        font-size: 18px;
        font-weight: 400;
        color: $white;
        background-color: $black;
        padding: 5px;
        text-transform: uppercase;
        font-weight: 500;
        display: inline-block;
        margin: 10px 0;
        user-select: none;
    }

    // Hovers
    @media (hover: hover) {
        &:hover {
            cursor: pointer;
            .available {
                transform: scale(1.125);
                padding-left: 5px;
            }
            .svg {
                transform: scale(1.125);
            }
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        button {
            font-size: 22px;
        }
    }
}
</style>
