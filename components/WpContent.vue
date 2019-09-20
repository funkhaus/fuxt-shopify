<script>
import fitvids from "fitvids"
import sanitizeHtml from "sanitize-html"

export default {
    props: {
        html: {
            type: String,
            default: ""
        },
        fitVidsPlayers: {
            type: Array,
            default: () => [
                'iframe[src*="vimeo.com"]',
                'iframe[src*="youtube.com"]',
                'iframe[src*="soundcloud.com"]',
                "iframe.fit-vid"
            ]
        },
        unwrap: {
            type: String,
            default: "p > iframe, p > img.alignnone"
        }
    },
    computed: {
        htmlTemplate() {
            return (
                sanitizeHtml(this.html, {
                    allowedTags: false,
                    allowedAttributes: false,
                    allowedIframeHostnames: false
                }) || ""
            )
        }
    },
    watch: {
        htmlTemplate() {
            this.unwrapElements(this.unwrap)
            this.initFitVids()
        }
    },
    mounted() {
        // Unwwrap elements
        this.unwrapElements(this.unwrap)

        // Start FitVids
        this.initFitVids()
    },
    methods: {
        wrapElements(selector, className = "wrapper") {
            // This will wrap all elements selected in a DIV with the provided class
            Array.from(this.$el.querySelectorAll(selector)).forEach(el => {
                const wrapper = document.createElement("div")
                wrapper.className = className
                el.parentNode.insertBefore(wrapper, el)
                el.parentNode.removeChild(el)
                wrapper.appendChild(el)
            })
        },
        unwrapElements(selector) {
            // This will unwrap all elements selected from it's parent
            Array.from(this.$el.querySelectorAll(selector)).forEach(el => {
                let elParentNode = el.parentNode

                if (elParentNode !== document.body) {
                    elParentNode.parentNode.insertBefore(el, elParentNode)
                    elParentNode.parentNode.removeChild(elParentNode)
                }
            })
        },
        initFitVids() {
            // Start FitVids
            fitvids(".wp-content", {
                ignore: [".ignore-fit-vids"],
                players: this.fitVidsPlayers
            })

            // Wrap all top level fitVids in another DIV, so we can set max-width in CSS
            this.wrapElements(":scope > .fluid-width-video-wrapper", "fit-vid")
        }
    },
    render(h) {
        return h({
            template: `<div class="wp-content">${this.htmlTemplate}</div>`
        })
    }
}
</script>
