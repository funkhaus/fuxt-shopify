<!-- This will be our App.vue -->
<template>
    <main class="container">
        <shopify-mini-cart />

        <nuxt />
    </main>
</template>

<script>
// Components
import shopifyMiniCart from "~/components/shopify/MiniCart"

export default {
    components: {
        shopifyMiniCart
    },
    mounted() {
        // Check that our checkout hasn't completed
        this.$store.dispatch("shopify/GET_CHECKOUT")
    }
}
</script>

<style lang="scss">
.container {
    color: black;

    a {
        color: black;
    }
}
</style>
