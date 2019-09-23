<template>
    <div class="product-image-single">
        <!-- Only renders Featured image, not slideshow -->
        <responsive-image
            v-if="image"
            class="featured-image"
            :src="image.src"
            :aspect-ratio="100"
            object-fit="contain"
        />
        <!-- Use placeholder if no image exists -->
        <responsive-image
            v-else
            class="featured-image"
            src="/images/product_placeholder.png"
            :aspect-ratio="100"
            object-fit="contain"
        />
    </div>
</template>

<script>
export default {
    props: {
        image: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style lang="scss">
.product-image-single {
    position: relative;
}
</style>
