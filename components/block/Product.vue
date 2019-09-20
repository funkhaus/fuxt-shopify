<template>
    <nuxt-link
        :class="classes"
        :to="parsedUrl"
    >
        <responsive-image
            v-if="parsedSrc"
            class="product-image"
            :src="parsedSrc"
            :aspect-ratio="107"
            object-fit="contain"
        >
            <span
                v-if="!available"
                class="sold-out"
                v-text="'Sold Out'"
            />
        </responsive-image>

        <responsive-image
            v-else
            class="product-image"
            src="/images/product_placeholder.png"
            :aspect-ratio="107"
            object-fit="contain"
        >
            <span
                v-if="!available"
                class="sold-out"
                v-text="'Sold Out'"
            />
        </responsive-image>

        <div class="meta">
            <h3
                class="collection"
                v-html="collection"
            />
            <h3
                class="title"
                v-html="title"
            />
            <wp-content
                class="description"
                :html="description"
            />

            <span class="price">
                {{ price | money }}
            </span>
            <span
                v-if="salePrice"
                class="sale-price"
            >
                {{ salePrice | money }}
            </span>
        </div>
    </nuxt-link>
</template>

<script>
import _get from "lodash/get"

import wpContent from "~/components/WpContent"

export default {
    components: {
        wpContent
    },
    props: {
        image: {
            type: Object,
            default: () => {}
        },
        src: {
            type: Object,
            default: () => {}
        },
        collection: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        price: {
            type: String,
            default: ""
        },
        salePrice: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: ""
        },
        caption: {
            type: String,
            default: ""
        },
        available: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        classes() {
            return ["block-product", { unavailable: !this.available }]
        },
        parsedSrc() {
            // return this.src.edges[0].node.src || ""
            return _get(this, "src.edges[0].node.src", "")
        },
        parsedUrl() {
            return `/shop/${this.url}`
        }
    }
}
</script>

<style lang="scss">
.block-product {
    padding: 0 10px;
    text-align: left;

    display: inline-block;
    box-sizing: border-box;

    .product-image {
        margin-bottom: 10px;
        .sizer {
            overflow: hidden;
            transition: all 0.4s;
        }
        .media {
            transition: all 0.4s;
        }
        .sold-out {
            position: absolute;
            top: 5%;
            right: 5%;
            text-transform: uppercase;
            color: $white;
            background-color: $black;
            padding: 5px;
            z-index: 10;
            line-height: 1;
        }
    }

    .meta {
        position: relative;
        .title,
        .description,
        .collection {
            margin: 0 0 5px 0;

            font-weight: 300;
            font-size: 16px;
        }

        .collection {
            margin: 0;
        }

        .title {
            font-size: 14px;
            position: relative;
            display: inline-block;
            &:after {
                content: "";
                position: absolute;
                left: 0;
                bottom: -1px;
                height: 2px;
                background-color: $black;
                width: 0;
                transition: width 0.25s;
            }
        }
        .description {
            font-size: 12px;
            * {
                font-size: 12px;
                margin: 0;
            }
        }

        .price {
            position: absolute;
            top: 0px;
            right: 0;
            margin: 0;
            font-size: 11px;
            background: $white;
            padding: 0 0 1px 1px;
        }
        // TODO: SHOP: sale / compare at price?
        .sale-price {
        }
    }
    //  Sold Out Styles
    &.unavailable {
        background-color: rgba($black, 0.125);

        .product-image {
            filter: brightness(0.875);
        }
        .meta .price {
            background-color: transparent;
        }
    }
    // Hovers
    @media (hover: hover) {
        &:hover {
            cursor: pointer;
            .product-image .media {
                transform: scale(1.05);
            }
            .title:after {
                width: 100%;
            }
        }
    }
    // Breakpoints
    @media #{$gt-cinema} {
        .meta {
            .collection {
                font-size: 22px;
            }
            .title {
                font-size: 18px;
            }
            .price {
                font-size: 16px;
            }
        }
    }
    @media #{$lt-tablet} {
        margin-bottom: 20px;
    }
}
</style>
