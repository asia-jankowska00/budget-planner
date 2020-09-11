<template>
    <i v-if="!isSideNavTrigger" class="material-icons" v-bind:class="directionClass">{{name}}</i>

    <a v-else data-target="slide-out" class="sidenav-trigger">
        <i class="material-icons" v-bind:class="directionClass">{{name}}</i>
    </a>
</template>

<script>
export default {
    name: 'Icon',
    props: {
        name: {
            type: String,
            required: true
        },
        direction: String,
        isSideNavTrigger: Boolean
    },
    computed: {
        directionClass: function () {
            return {
                "left": this.direction && this.direction.toLowerCase() === "left",
                "right": this.direction && this.direction.toLowerCase() === "right"
            }
        }
    }
}
</script>

<style>

</style>