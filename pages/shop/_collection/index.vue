<template>
    <loading-icon v-if="$apollo.loading" />

    <section
        v-else
        class="page-collection"
    >
        <p>Should query the collection and show a grid of products here</p>
    </section>
</template>
