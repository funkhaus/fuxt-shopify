<template>
    <client-only>
        <section class="cart">
            <p>
                Need to build this
            </p>

            <a
                :href="$store.state.shopify.checkout.webUrl"
                target="_blank"
            >Checkout</a>
        </section>
    </client-only>
</template>

<script>
export default {
    async mounted() {
        // Fetch new checkout from Shopify just to be sure!
        await this.$store.dispatch("shopify/GET_CHECKOUT")

        // NOTE Maybe this should be an Apollo query?
    }
}
</script>
