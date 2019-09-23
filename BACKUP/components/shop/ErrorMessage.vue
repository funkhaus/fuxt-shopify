<template>
    <div class="error-message">
        <h2 v-if="type === 'collection'">
            There's nothing in this {{ type }}
        </h2>
        <h2 v-else-if="type === 'product'">
            This {{ type }} cannot be found
        </h2>
        <h2 v-else>
            Oops, there's been an error
        </h2>
        <nuxt-link to="/shop">
            Back to store
        </nuxt-link>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        }
    }
}
</script>

<style lang="scss">
.error-message {
    min-height: 50vh;
    text-align: center;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;

    align-items: center;
    a {
        position: relative;
        &:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            height: 1px;
            background-color: $black;
            width: 0;
            transition: width 0.25s;
            width: 100%;
        }
    }
}
</style>
