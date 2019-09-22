import pkg from "./package"

export default {
    mode: "universal",

    /*
     ** Headers of the page
     */
    head: {
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }]
    },

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        { src: "~/plugins/global-component-loader.js" },
        { src: "~/plugins/google-gtag.client.js", mode: "client" }
        //{ src: "~/plugins/shopify.js", mode: "client" }
    ],

    /*
     ** Nuxt.js modules
     */
    modules: ["@nuxtjs/apollo"],

    /*
     ** Apollo options. Used for Graph QL queries
     ** See: https://www.apollographql.com/docs/link/links/http.html#options
     */
    apollo: {
        clientConfigs: {
            default: {
                httpEndpoint:
                    "http://stackhaus-backend.flywheelsites.com/graphql",
                persisting: false
            },
            shopify: {
                httpEndpoint:
                    "https://shopwolfentertainment.myshopify.com/api/2019-07/graphql.json",
                httpLinkOptions: {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Storefront-Access-Token":
                            "41df419c5323c953aa29bf90312e15a1"
                    }
                },
                persisting: false
            }
        }
    },

    /*
     ** Customize router
     */
    router: {
        linkExactActiveClass: "exact-active-link",
        linkActiveClass: "active-link"
    }
}
