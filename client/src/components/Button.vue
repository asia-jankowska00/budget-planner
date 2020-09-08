<template>
  <button 
    v-if="!isLink"
    class="waves-effect waves-dark btn blue accent-3" 
    :class="classObject" 
    :type="type"
    :id="id">
      <Icon v-if="icon" :name="icon.name" :direction="icon.direction"/>
        {{label}}
  </button>

  <a 
    v-else
    class="waves-effect waves-dark btn blue accent-3" 
    :class="classObject" 
    :type="type"
    :id="id">
      <Icon v-if="icon" :name="icon.name" :direction="icon.direction"/>
        {{label}}
  </a>
</template>

<script>
import Icon from '@/components/Icon'
export default {
  name: 'Button',
  components: {
    Icon
  },
  props: {
    label: String,
    icon: Object,
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
    },
    id: String,
    isFloating: Boolean,
    isLink: Boolean
  },
  computed: {
    classObject: function() {
      return {
        "btn-large": this.size === 'large',
        "btn-small": this.size === 'small',
        "btn-floating": this.isFloating
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
