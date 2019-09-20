<!-- This will be our App.vue -->
<template>
    <main :class="classes">
        <site-icon-cart />

        <nuxt />
    </main>
</template>

<script>
import Vue from "vue"
import _throttle from "lodash/throttle"
import _kebabCase from "lodash/kebabCase"
import { decodeHtmlEntity } from "~/utils/tools"

import siteIconCart from "~/components/site/IconCart"

export default {
    components: {
        siteIconCart
    },
    data() {
        let output = {
            winHeight: 0,
            winWidth: 0,
            sTop: 0
        }

        // On client side, we have window so set the height/width
        if (process.client) {
            output.winHeight = window.innerHeight
            output.winWidth = window.innerWidth
        }
        return output
    },
    computed: {
        classes() {
            return [
                "container",
                "main",
                `breakpoint-${this.breakpoint}`,
                `route-${_kebabCase(this.$route.name)}`,
                { "menu-opened": this.$store.state.menuOpened },
                { "is-scrolled": this.sTop > 0 },
                { "is-ssr": process.server }
            ]
        },
        breakpoint() {
            let breakpoint = "desktop"

            switch (true) {
                case this.winWidth == 0:
                    breakpoint = "desktop"
                    break

                case this.winWidth <= 1024:
                    breakpoint = "mobile"
                    break

                default:
                    breakpoint = "desktop"
            }

            if (this.$store.state.breakpoint != breakpoint) {
                this.$store.commit("SET_BREAKPOINT", breakpoint)
            }
            return breakpoint
        }
    },
    mounted() {
        // Throttle common events
        window.addEventListener("resize", _throttle(this.onResize, 30))
        window.addEventListener("scroll", _throttle(this.onScroll, 10))

        // Trigger a resize to start
        this.onResize()

        // Monitor keydown
        window.addEventListener("keydown", e => {
            switch (e && e.key) {
                case "Escape":
                    this.$store.commit("CLOSE_MENU")
                    break
            }
        })
    },
    methods: {
        onResize() {
            this.winWidth = window.innerWidth
            this.winHeight = window.innerHeight
            let dimensions = {
                height: this.winHeight,
                width: this.winWidth
            }
            this.$store.commit("SET_WIN_DIMENSIONS", dimensions)
        },
        onScroll() {
            this.sTop = window.pageYOffset || document.documentElement.scrollTop
            this.$store.commit("SET_S_TOP", this.sTop)
        }
    }
}
</script>

<style lang="scss">
.container {
}
</style>
