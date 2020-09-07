<template>
  <button class="waves-effect waves-dark btn blue accent-3" :class="sizeClass" :type="type">
    <Icon v-if="icon" :name="icon.name" :direction="icon.direction"/>
    {{label}}
  </button>
</template>

<script>
import Icon from '@/components/Icon'
export default {
  name: 'Button',
  components: {
    Icon
  },
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
    },
    size: {
      type: String,
      validator: function (value) {
        return ['small', 'large'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    sizeClass: function() {
      return {
        "btn-large": this.size === 'large',
        "btn-small": this.size === 'small'
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
