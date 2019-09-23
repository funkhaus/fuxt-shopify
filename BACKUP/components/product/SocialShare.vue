<template>
    <div class="social-share-menu">
        <span class="field-title">
            Share
        </span>

        <ul>
            <li
                v-for="(link, i) in shareLinks"
                :key="i"
            >
                <a
                    class="share-link"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    v-html="link.site"
                />
            </li>
        </ul>
    </div>
</template>

<script>
import _get from "lodash/get"
import { buildShareLinks } from "~/utils/shared"

export default {
    props: {
        shareText: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        }
    },
    computed: {
        pageURL() {
            let url = encodeURI(this.$store.state.siteMeta.host)
            if (process.client) {
                url = encodeURI(window.location.href)
            }
            return url
        },
        shareLinks() {
            const links = buildShareLinks({
                url: this.pageURL,
                text: this.shareText,
                title: this.title
            })
            return [
                { site: "Facebook", url: links.facebook },
                { site: "Twitter", url: links.twitter },
                { site: "Pinterest", url: links.pinterest }
            ]
        }
    }
}
</script>

<style lang="scss">
.social-share-menu {
    ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
    }

    li {
        display: inline-block;
        a {
            margin: 20px;
            font-size: 16px;
            text-transform: uppercase;
            position: relative;
            &:first-child {
                margin-left: 0;
            }
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
        }
    }

    // Hovers
    @media (hover: hover) {
        li a:hover:after {
            width: 100%;
        }
    }

    // Breakpoints
    @media #{$gt-cinema} {
        li a {
            font-size: 22px;
        }
    }
}
</style>
