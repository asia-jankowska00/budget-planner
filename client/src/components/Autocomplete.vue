<template>
  <div class="input-field autocomplete-wrapper">
    <input type="text" :id="id" class="autocomplete" :value="value" v-on:input="$emit('input', $event.target.value)"/>
    <label :for="id">{{label}}</label>
  </div>
</template>

<script>
import M from 'materialize-css';

export default {
  name: 'Autocomplete',
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  mounted() {
    var elem = document.querySelectorAll('.autocomplete');
    M.Autocomplete.init(elem, {
      data: this.data,
      onAutocomplete: this.autocompleteHandler
    });
  },
  watch: {
    data: function(newData) {
      this.updateData(newData)
    }
  },
  methods: {
    updateData(newData) {
      const elem = document.querySelector('.autocomplete');
      const Autocomplete = M.Autocomplete.getInstance(elem);

      const newDataObj = {}
      newData.forEach(d => newDataObj[d.username] = null)

      Autocomplete.updateData(newDataObj); 
      Autocomplete.open();
    },
    autocompleteHandler(newValue) {
      this.$emit('input', newValue);
    }
  }
};
</script>

<style lang="scss">
</style>
