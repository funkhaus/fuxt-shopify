<template>
    <div class="product-image-slideshow">
        <div
            v-if="showSlideshow"
            v-swiper:products="productSwiperOptions"
            @slideChange="updateIndex()"
        >
            <div class="swiper-wrapper">
                <div
                    v-for="(image, i) in images"
                    :key="i"
                    class="swiper-slide"
                >
                    <responsive-image
                        class="featured-image"
                        :src="image.src"
                        :aspect-ratio="100"
                        object-fit="contain"
                    />
                </div>
            </div>
        </div>

        <svg-icon-minus
            slot="button-prev"
            class="button-prev"
        />
        <svg-icon-plus
            slot="button-next"
            class="button-next"
        />

        <product-progress-bar
            :slides-length="images.length"
            :active-index="activeIndex"
        />
    </div>
</template>

<script>
export default {
    props: {
        product: {
            type: Object,
            default: () => {}
        },
        images: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            activeIndex: 0,
            showSlideshow: false,
            productSwiperOptions: {
                loop: true,
                slidesPerView: 1,
                navigation: {
                    nextEl: ".button-next",
                    prevEl: ".button-prev"
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.showSlideshow = true
        })
    },
    methods: {
        updateIndex() {
            this.activeIndex = this.products.realIndex
        }
    }
}
</script>

<style lang="scss">
.product-image-slideshow {
    position: relative;
    .swiper-wrapper {
        position: relative;
    }
    // Navigation
    .button-next,
    .button-prev {
        position: absolute;
        bottom: -30px;
        left: 0px;
        padding: 10px;
        transition: all 0.4s ease-in-out;
        &:focus {
            outline: none;
        }
    }
    .button-next {
        left: unset;
        right: 0px;
        bottom: -35px;
    }

    // Hovers
    @media (hover: hover) {
        .button-next:hover,
        .button-prev:hover {
            cursor: pointer;
        }
    }
}
</style>
