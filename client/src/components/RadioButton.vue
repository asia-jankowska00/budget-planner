<template>
  <label :for="id">
    <input
      :id="id"
      class="with-gap"
      :name="name"
      type="radio"
      :value="value"
      v-on:change="$emit('change', $event.target.value)"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "RadioButton",
  model: {
    prop: "isExpense",
    event: "change",
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
[type="radio"]:checked + span::after,
[type="radio"].with-gap:checked + span::before,
[type="radio"].with-gap:checked + span::after {
  border: 2px solid #2979ff;
}
[type="radio"]:checked + span::after,
[type="radio"].with-gap:checked + span::after {
  background-color: #2979ff;
}
</style>
