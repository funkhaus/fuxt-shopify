<template>
    <site-loading />
</template>

<script>
import _get from "lodash/get"
import siteLoading from "~/components/site/Loading"
import config from "~/nuxt.config"

export default {
    components: {
        siteLoading
    },
    transition: "fade",
    mounted() {
        let gqlEndpoint = _get(
            config,
            "apollo.clientConfigs.shopify.httpEndpoint",
            ""
        )

        window.location = `${gqlEndpoint.split("/api")[0]}/admin`
    }
}
</script>
