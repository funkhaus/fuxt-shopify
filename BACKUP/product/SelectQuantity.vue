<template>
    <div class="product-select-quantity">
        <span
            class="field-title"
            v-text="'Quantity'"
        />

        <span class="quantity-select">
            <div
                class="slot-wrapper decrement"
                @click="decrementQuantity()"
            >
                <slot name="decrement" />
            </div>

            <span class="count">{{ selectedQuantity }}</span>

            <div
                class="slot-wrapper increment"
                @click="incrementQuantity()"
            >
                <slot name="increment" />
            </div>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        productQuantity: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            selectedQuantity: 1
        }
    },
    watch: {
        productQuantity(newVal, oldVal) {
            console.log("productQuantity update")
            this.selectedQuantity = this.productQuantity
        }
    },
    methods: {
        incrementQuantity() {
            this.selectedQuantity++
            this.$emit("select-quantity", this.selectedQuantity)
        },
        decrementQuantity() {
            if (this.selectedQuantity > 1) {
                this.selectedQuantity--
                this.$emit("select-quantity", this.selectedQuantity)
            }
        }
    }
}
</script>

<style lang="scss">
.product-select-quantity {
    .quantity-select {
        display: inline-block;

        font-size: 16px;
        text-transform: uppercase;
        font-weight: 400;
        margin-left: 20px;
        line-height: 1;

        .slot-wrapper {
            display: inline-block;
            svg {
                vertical-align: middle;
            }
        }

        .count {
            font-size: 20px;
            padding: 0 10px;
            display: inline-block;
            vertical-align: middle;
        }

        // Hovers
        @media (hover: hover) {
            &:hover {
                cursor: pointer;
            }
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        .quantity-select .count {
            font-size: 27px;
        }
    }
}
</style>
