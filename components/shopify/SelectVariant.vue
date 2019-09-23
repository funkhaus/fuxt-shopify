<template>
    <fieldset :class="classes">
        <label :for="forAttr">
            <slot>Select option</slot>
        </label>

        <select
            :id="forAttr"
            v-model="selectedId"
            @change="selectChange"
        >
            <option
                v-if="!selectFirst"
                value=""
                disabled
                selected
            >
                <slot name="select-prompt">
                    Please select
                </slot>
            </option>

            <option
                v-for="variant in stripedVariants"
                :key="variant.id"
                :disabled="!variant.availableForSale"
                :value="variant.id"
            >
                {{ variant.title }}
            </option>
        </select>
    </fieldset>
</template>

<script>
// Helpers
import _get from "lodash/get"
import _find from "lodash/find"
import _uniqueId from "lodash/uniqueId"

export default {
    props: {
        variants: {
            type: [Object, Array],
            default: () => {}
        },
        selectFirst: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectedId: ""
        }
    },
    computed: {
        classes() {
            return [
                "shopify-select-variant",
                { "has-one-variant": this.stripedVariants.length == 1 },
                { "is-selected": this.selectedId }
            ]
        },
        stripedVariants() {
            // Remove edges, or if that has already been handled, deal with it direct.
            let variants = _get(this, "variants.edges", this.variants)
            return variants.map(variant => variant.node)
        },
        forAttr() {
            return _uniqueId("select-quantity-")
        }
    },
    watch: {
        selectedId(newVal, oldVal) {
            this.selectChange()
        }
    },
    mounted() {
        // If selectFirst
        if (this.selectFirst) {
            this.selectedId = this.stripedVariants[0].id
        }
    },
    methods: {
        selectChange() {
            // Return the entire sleected varient object
            const selectedVariant = _find(this.stripedVariants, {
                id: this.selectedId
            })
            this.$emit("selected-variant", selectedVariant)
        }
    }
}
</script>

<style lang="scss">
.shopify-select-variant {
    border: none;
    padding: 0;
}
</style>
