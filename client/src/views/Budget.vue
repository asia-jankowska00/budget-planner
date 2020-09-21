<template>
  <div v-if="budgets.length > 0 && selectedBudget" id="budgets" class="content-wrapper">
    <Select
      id="mainBudget"
      label="Your sources"
      :options="budgets"
      v-model="selectedBudgetId"
      displayKey="name"
      valueKey="id"
    />
  </div>
  <div v-else class="empty-view">Looks like you don't have any budgets.</div>
</template>

<script>
import { mapGetters } from "vuex";
import Select from '@/components/Select'
// import M from "materialize-css";

export default {
  name: 'Budget',
  components: {
    Select
  },
  computed: {
    ...mapGetters(["budgets", "selectedBudget", "transactions", 'isLoadingTransactions', 'user']),
    selectedBudgetId: {
      get () {
        return this.selectedBudget.id
      },
      set (value) {
        const newBudgetId = parseInt(value)
        this.$store.commit('updateSelectedBudget', this.budgets.find(budget => budget.id === newBudgetId))
        // this.$store.dispatch("getBudgetTransactions", newBudgetId)
        //   .catch((err) => {
        //     M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
        //   });
      }
    }
  },
}
</script>

<style lang="scss">
</style>