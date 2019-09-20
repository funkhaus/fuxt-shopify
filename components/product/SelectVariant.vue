<template>
    <div class="product-select-variant">
        <span
            class="field-title"
            v-html="variantTitle"
        />

        <slot />

        <select
            v-model="selected"
            :class="['select-variant', { error: error }]"
            @change="selectChange"
        >
            <option
                value=""
                disabled
                selected
            >
                Select
            </option>
            <!-- NOTE: Need to render obj in val to get obj by id and display title -->
            <option
                v-for="variant in variants"
                v-if="variant.availableForSale"
                :value="{
                    id: variant.id,
                    text: variant.title,
                    price: variant.price,
                    compareAtPrice: variant.compareAtPrice
                }"
            >
                {{ variant.title }}
            </option>
        </select>
        <span
            v-if="error"
            class="variant-error-message"
        >
            Please select a {{ variantTitle }}
        </span>
    </div>
</template>

<script>
import _find from "lodash/find"

export default {
    props: {
        variantTitle: {
            type: String,
            default: ""
        },
        error: {
            type: Boolean,
            default: false
        },
        variants: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            selected: ""
        }
    },
    methods: {
        selectChange() {
            this.$emit("select-variant", this.selected)
        }
    }
}
</script>

<style lang="scss">
.product-select-variant {
    margin-right: 40px;
    .svg {
        max-height: 14px;
        width: auto;
        margin-left: 20px;
        margin-bottom: -1px;
    }

    .select-variant {
        font-size: 16px;
        color: $black;
        line-height: 1.2;
        padding: 10px 5px;
        box-sizing: border-box;
        margin: 0;
        border: 2px solid $white;
        appearance: none;
        background-color: $white;
        text-transform: uppercase;

        letter-spacing: 1px;
        transition: all 0.4s ease-in-out;
        &:focus {
            outline: none;
            color: none;
        }
        &.error {
            border: 2px solid $blue;
        }
    }

    .variant-error-message {
        transition: all 0.4s ease-in-out;
        color: $blue;
    }

    // Hovers
    @media (hover: hover) {
        .select-variant:hover {
            cursor: pointer;
        }
    }
    // Breakpoints
    @media #{$gt-cinema} {
        .select-variant {
            font-size: 22px;
        }
        .svg {
            max-height: 18px;
        }
    }
}
</style>
