<template>
  <button 
    v-if="!isLink"
    class="waves-effect waves-dark" 
    :class="classObject" 
    :type="type"
    :id="id"
    @click="$emit('click')">
      <Icon v-if="icon" :name="icon.name" :direction="icon.direction"/>
        {{label}}
  </button>

  <a 
    v-else
    class="waves-effect waves-dark" 
    :class="classObject" 
    :type="type"
    :id="id"
    @click="$emit('click')">
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
    isFlat: Boolean,
    isLink: Boolean,
    isDisabled: Boolean
  },
  computed: {
    classObject: function() {
      return {
        "btn-large": this.size === 'large',
        "btn-small": this.size === 'small',
        "btn-floating": this.isFloating,
        "btn blue accent-3": !this.isFlat,
        "btn-flat": this.isFlat,
        "disabled": this.isDisabled
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
