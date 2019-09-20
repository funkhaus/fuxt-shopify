<template>
    <div :class="classes">
        <div
            class="sizer"
            :style="sizerStyles"
        >
            <img
                v-if="parsedSrc"
                class="media image"
                :src="parsedSrc"
                :style="mediaStyles"
                @load="setLoaded('image')"
            >
            <video
                v-if="parsedVideoUrl"
                ref="video"
                class="media video"
                :src="parsedVideoUrl"
                :style="mediaStyles"
                :poster="parsedSrc"
                :loop="loop"
                :autoplay="autoplay"
                :muted="muted"
                :playsinline="playsinline"
                @loadeddata="setLoaded('video')"
            />
        </div>
        <slot />
    </div>
</template>

<script>
import Vue from "vue"
import _get from "lodash/get"

export default {
    props: {
        image: {
            type: Object,
            default: () => {}
        },
        height: {
            type: Number,
            default: null
        },
        width: {
            type: Number,
            default: null
        },
        src: {
            type: String,
            default: ""
        },
        alt: {
            type: String,
            default: ""
        },
        aspectRatio: {
            type: Number,
            default: null
        },
        objectFit: {
            type: String,
            default: "cover"
        },
        mode: {
            type: String,
            default: "intrinsic-ratio"
        },
        backgroundColor: {
            type: String,
            default: ""
        },
        videoUrl: {
            type: String,
            default: ""
        },
        loop: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        muted: {
            type: Boolean,
            default: true
        },
        playsinline: {
            type: Boolean,
            default: true
        },
        srcset: {
            type: String,
            default: ""
        },
        focalPoint: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            loadedStatus: {
                booted: false
            }
        }
    },
    computed: {
        classes() {
            return [
                "responsive-image",
                `mode-${this.mode}`,
                { "has-loaded": this.hasLoaded },
                { "has-background-color": this.backgroundColor }
            ]
        },
        aspectPadding() {
            return (
                this.aspectRatio || (this.parsedHeight / this.parsedWidth) * 100
            )
        },
        parsedHeight() {
            // default to defined height
            if (this.height) {
                return parseInt(this.height)
            }
            return this.image.mediaDetails.height
        },
        parsedWidth() {
            // default to defined width
            if (this.width) {
                return parseInt(this.width)
            }
            return this.image.mediaDetails.width
        },
        parsedSrc() {
            return this.src || this.image.sourceUrl
        },
        parsedAlt() {
            if (this.alt) {
                return this.alt || this.image.caption
            }
        },
        parsedColor() {
            return (
                this.color || _get(this, "image.acfImageMeta.primaryColor", "")
            )
        },
        parsedVideoUrl() {
            return (
                this.videoUrl || _get(this, "image.acfImageMeta.videoUrl", "")
            )
        },
        parsedFocalPoint() {
            return {
                x:
                    _get(this, "focalPoint.x", false) ||
                    _get(this.image, "acfImageMeta.focalPointX", ""),
                y:
                    _get(this, "focalPoint.y", false) ||
                    _get(this.image, "acfImageMeta.focalPointY", "")
            }
        },
        sizerStyles() {
            let styles = {}

            // Set padding for size
            if (this.mode == "intrinsic-ratio") {
                styles.paddingBottom = `${this.aspectPadding}%`
            }

            // Set background color
            if (this.parsedColor) {
                styles.backgroundColor = `${this.parsedColor}`
            }

            return styles
        },
        mediaStyles() {
            let styles = {
                objectFit: this.objectFit
            }

            if (
                this.parsedFocalPoint.x !== "" &&
                this.parsedFocalPoint.y !== ""
            ) {
                styles.objectPosition = `${this.parsedFocalPoint.x}% ${this.parsedFocalPoint.y}%`
            }

            return styles
        },
        hasLoaded() {
            // Check if all are true. To handle if we have a video and an image.
            return Object.values(this.loadedStatus).every(Boolean)
        }
    },
    watch: {
        // Update loaded state if new src set
        parsedVideoUrl(newVal, oldVal) {
            if (newVal) {
                Vue.set(this.loadedStatus, "video", false)
            }
        },
        // Update loaded state if new src set
        parsedSrc(newVal, oldVal) {
            if (newVal) {
                Vue.set(this.loadedStatus, "image", false)
            }
        }
    },
    mounted() {
        // Setup loaded state tracking
        if (this.parsedVideoUrl) {
            Vue.set(this.loadedStatus, "video", false)
        }
        if (this.parsedSrc) {
            Vue.set(this.loadedStatus, "image", false)
        }

        // Set the booted flag
        Vue.set(this.loadedStatus, "booted", true)
    },
    methods: {
        setLoaded(type) {
            Vue.set(this.loadedStatus, type, true)
        },
        play() {
            // HTML5 video methods
            if (this.$refs.video) {
                this.$refs.video.play()
            }
        },
        pause() {
            // HTML5 video methods
            if (this.$refs.video) {
                this.$refs.video.pause()
            }
        }
    }
}
</script>

<style lang="scss">
.responsive-image {
    .sizer {
        position: relative;
    }
    .media {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 1;
        transition: opacity 0.4s ease-in-out;
        z-index: 10;
    }
    .video {
        z-index: 20;
    }

    // Modes
    &.mode-intrinsic-ratio {
        position: relative;
    }
    &.mode-fullbleed {
        .sizer {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
        }
    }

    // Loaded state
    &.has-loaded .media {
        // opacity: 1;
    }
}
</style>
