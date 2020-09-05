<template>
  <button class="waves-effect waves-dark btn teal darken-3" :type="type">
    <i 
      v-if="icon"
      class="material-icons" 
      v-bind:class="directionClass">
        {{icon.name}}
    </i>
    {{label}}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    label: {
      type: String,
      required: true
    },
    icon: {
      type: Object,
      required: false
    },
    type: {
      type: String,
      default: function () {
        return "button"
      },
      validator: function (value) {
        return ['button', 'submit', 'reset'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    directionClass: function () {
      const isDirectionRight = this.icon && this.icon.direction.toLowerCase() === "right";

      return {
        "left": !isDirectionRight,
        "right": isDirectionRight
      }
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  margin: 8px;
}
</style>
