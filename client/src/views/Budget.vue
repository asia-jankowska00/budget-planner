<template>
  <div v-if="budgets.length > 0">You have {{budgets.length}} budgets. </div>
  <div v-else class="empty-view">Looks like you don't have any budgets.</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Budget',
  computed: mapState({
    budgets: state => state.budgets
  }),
}
</script>

<style scoped>
</style>