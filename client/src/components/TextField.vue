<template>
  <div class="text-field">
    <div class="field-data">
      <span class="label">{{label}}</span>
      <p v-if="value" class="value">{{value}}</p>
      <p v-else class="value">-</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    label: {
      type: String,
      required: true
    },
    value: String
  }
}
</script>

<style lang="scss" scoped>
.text-field {
  font-size: 0.9rem;
  margin: 16px 0;

  .label {
    color: #37474F
  }

  .value {
    color: #0671BF;
  }
}
</style>