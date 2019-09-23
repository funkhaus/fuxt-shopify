<template>
    <fieldset class="shopify-select-quantity">
        <label :for="forAttr">
            <slot>Quantity</slot>
        </label>

        <input
            :id="forAttr"
            v-model="quantity"
            type="number"
            min="1"
            @change="selectChange"
        >
    </fieldset>
</template>

<script>
// Helpers
import _uniqueId from "lodash/uniqueId"

export default {
    data() {
        return {
            quantity: 1
        }
    },
    computed: {
        forAttr() {
            return _uniqueId("select-quantity-")
        }
    },
    methods: {
        selectChange() {
            this.$emit("selected-quantity", this.quantity)
        }
    }
}
</script>

<style lang="scss">
.shopify-select-quantity {
    border: none;
    padding: 0;
}
</style>
