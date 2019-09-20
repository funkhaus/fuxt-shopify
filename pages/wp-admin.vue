<template>
    <loading-icon />
</template>

<script>
import _get from "lodash/get"

import config from "~/nuxt.config"

export default {
    components: {
        
    },
    transition: "fade",
    mounted() {
        let gqlEndpoint = _get(
            config,
            "apollo.clientConfigs.default.httpEndpoint",
            ""
        )

        window.location = `${gqlEndpoint.split("/graphql")[0]}/wp-admin`
    }
}
</script>
