<template>
    <i 
        class="material-icons" 
        v-bind:class="directionClass">
            {{name}}
    </i>
</template>

<script>
export default {
    name: 'Icon',
    props: {
        name: {
            type: String,
            required: true
        },
        direction: String
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