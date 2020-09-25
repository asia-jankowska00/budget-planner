<template>
  <section v-if="budgets.length > 0 && selectedBudget" id="budgets" class="content-wrapper">
    <div class="control">
      <Select
        id="mainBudget"
        label="Budgets"
        :options="budgets"
        v-model="selectedBudgetId"
        displayKey="name"
        valueKey="id"
      />

      <Icon name="edit" @click.native="goToEdit" v-if="selectedBudget.owner.id === user.id"/>
    </div>
    
    <div id="budgetCollaborators" v-if="budgetCollaborators && !isBudgetLoading">
      <p class="collaborator" v-for="person in budgetCollaborators" :key="'collaborator' + person.id">
        <span class="circle">{{person.firstName[0]}}</span>
      </p>
    </div>
    
    <div id="budgetSources" v-if="budgetSources && !isBudgetLoading">
      <h4 id="amount" class="primary">
        {{format(user.currency.code, budgetTotal, true)}} 
      </h4>
      <p class="source" v-for="source in budgetSources" :key="'source' + source.id">{{source.name}}</p>
    </div>
    
    <TransactionsGrid
      v-if="!isBudgetLoading"
      :transactions="budgetTransactions"
      :currency="user.currency"
    />

    <Loader v-else text="Loading budget data" :isSmall="true"/>
  </section>
  <div v-else-if="budgets.length === 0" class="empty-view">Looks like you don't have any budgets.</div>
</template>

<script>
import { mapGetters } from "vuex";
import Select from '@/components/Select'
import Icon from '@/components/Icon'
import TransactionsGrid from '@/components/TransactionsGrid'
import Loader from '@/components/Loader'
import M from "materialize-css";
import formatter from '../helpers/formatter';

export default {
  name: 'Budget',
  components: {
    Select,
    Loader,
    TransactionsGrid,
    Icon
  },
  methods: {
    format(code, amount, showSymbol) {
      return formatter.formatAmount(code, amount, showSymbol);
    },
    goToEdit() {
      this.$router.push({ path: `budgets/${this.selectedBudget.id}/edit` })
    }
  },
  computed: {
    ...mapGetters([
      "budgets", 
      "selectedBudget",
      "budgetTransactions",
      'user',
      'budgetSources',
      'budgetCollaborators',
      'isBudgetLoadingSources',
      'isBudgetLoadingCollaborators',
      'isLoadingBudgetTransactions'
    ]),
    selectedBudgetId: {
      get () {
        return this.selectedBudget.id
      },
      set (value) {
        const newBudgetId = parseInt(value)
        this.$store.commit('updateSelectedBudget', this.budgets.find(budget => budget.id === newBudgetId))
        this.$store.dispatch("getBudgetSources", newBudgetId)
          .catch((err) => {
            M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
          });
        this.$store.dispatch("getBudgetCollaborators", newBudgetId)
          .catch((err) => {
            M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
          });
      }
    },
    isBudgetLoading() {
      return this.isBudgetLoadingSources || this.isBudgetLoadingCollaborators || this.isLoadingBudgetTransactions
    },
    budgetTotal: function() {
      let total = 0;
      this.budgetSources.forEach(source => total += source.convertedAmount ? source.convertedAmount : source.amount);

      return total;
    }
  },
  created() {
    if (!this.budgetSources && this.selectedBudget) {
      this.$store.dispatch("getBudgetSources", this.selectedBudget.id)
      .catch((err) => {
        M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
      });
    }

    if (!this.budgetCollaborators && this.selectedBudget) {
      this.$store.dispatch("getBudgetCollaborators", this.selectedBudget.id)
      .catch((err) => {
        M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
      });
    }

    if (!this.budgetTransactions && this.selectedBudget) {
      this.$store.dispatch("getBudgetTransactions", this.selectedBudget.id)
      .catch((err) => {
        M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
      });
    }
  },
  watch: {
    selectedBudget: function(budget) {
      if (budget) {
        this.$store.dispatch("getBudgetTransactions", budget.id)
        .catch((err) => {
          M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
        });

        this.$store.dispatch("getBudgetCollaborators", budget.id)
        .catch((err) => {
          M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
        });
      }
    }
  }
}
</script>

<style lang="scss">
#mainBudget {
  margin-bottom: 0;

  input {
    margin-bottom: 0;
  }
}
.collaborator {
  display: inline-block;
  margin-left: -12px;

  &:first-child {
    margin-left: 0;
  }

  &:nth-child(3n) {
    .circle {
      background: #ec8383;
    }
  }

  &:nth-child(3n+1) {
    .circle {
      background: cyan;
    }
  }

  &:nth-child(3n+2) {
    .circle {
      background: #ffc05f;
    }
  }

  .circle {
    background: cyan;
    font-size: 1rem;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    overflow: hidden;
  }
}

#budgetSources {
  .source {
    font-size: 0.85rem;
    margin: 0;
  }
}

.control {
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    cursor: pointer;
  }
}
</style>