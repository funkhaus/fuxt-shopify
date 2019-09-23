<template>
    <div class="product-progress-bar">
        <div class="grey-bar">
            <div
                class="current-index"
                :style="progressBarStyles"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        slidesLength: {
            type: Number,
            default: 0
        },
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        progressBarStyles() {
            // Calcs progress bar width from total slides
            let barWidth = 100 / this.slidesLength // match to grey bar width;
            // Moves progress bar on active index change
            return {
                transform: `translateX(${this.activeIndex * 100}%)`,
                width: `${barWidth}%`
            }
        }
    }
}
</script>

<style lang="scss">
@import "~/styles/_vars.scss";
.product-progress-bar {
    position: absolute;
    bottom: -20px;
    left: 50px;
    right: 50px;
    height: 2px;
    transition: all 0.25s;

    .grey-bar {
        background-color: rgba($black-secondary, 0.25);
        width: 100%;

        .current-index {
            height: 2px;
            background-color: $black;
            transition: all 0.25s;
        }
    }
    // Breakpoints
    @media #{$lt-tablet} {
        // display: none;
    }
}
</style>
