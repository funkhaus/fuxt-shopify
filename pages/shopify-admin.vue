<template>
    <loading-icon />
</template>

<script>
import _get from "lodash/get"

import config from "~/nuxt.config"

export default {
    components: {},
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
