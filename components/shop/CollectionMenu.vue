<template>
    <ul class="shop-collection-menu">
        <li class="disabled">
            sort by:
        </li>
        <!-- TODO: SHOP: Get menus from shopify, does not seem possible-->
        <li
            v-for="(collection, i) in collections"
            v-if="collections"
            :key="i"
        >
            <nuxt-link
                :to="`/shop/collections/${collection.handle}`"
                v-html="collection.title"
            />
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        collections: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="scss">
.shop-collection-menu {
    @include cinema-width;
    text-align: center;
    list-style: none;
    text-transform: uppercase;
    font-size: 16px;
    padding: 0;

    li {
        padding: 15px;
        display: inline-block;
        transition: all 0.4s;
        color: $grey;
        a {
            color: $grey;
            position: relative;
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
            &.exact-active-link {
                color: $black;
            }
        }
    }

    // Hovers
    @media (hover: hover) {
        li a:hover:after {
            width: 100%;
        }
    }
}
</style>
