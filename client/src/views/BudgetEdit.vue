<template>
  <div id="budgetEdit" class="content-wrapper">
    <h6 class="">Edit budget - <em>{{selectedBudget.name}}</em></h6>


  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BudgetEdit',
  computed: {
    ...mapGetters(['user', 'selectedBudget']),
  }
}
</script>

<style>
.title {
  text-align: center;
}
</style>