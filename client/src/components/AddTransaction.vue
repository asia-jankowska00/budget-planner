<template>
  <div id="addTransactionPopup">
    <form @submit.prevent="submit" class="row" autocomplete="off">
      <h5>Add transaction</h5>

      <RadioButton
        label="Expense"
        name="isExpense"
        :value="true"
        id="transactionTypeExpense"
        v-model="isExpense"
      />
      <RadioButton
        label="Income"
        name="isExpense"
        id="transactionTypeIncome"
        :value="false"
        v-model="isExpense"
      />

      <TextInput v-model="name" label="Name" type="text" id="transactionName" />
      <TextInput
        v-model="amount"
        label="Initial amount"
        type="number"
        id="transactionAmount"
        min="0"
        step="0.0001"
      />
      <Datepicker v-model="date" label="Date" id="transactionDate" />

      <Select
        id="transactionContainer"
        label="Budget"
        :options="budgets"
        v-model="budgetId"
        displayKey="name"
        valueKey="id"
        placeholder="Select budget"
      />
      <Select
        id="transactionSource"
        label="Source"
        :options="accessSources"
        v-model="sourceId"
        displayKey="name"
        valueKey="id"
        placeholder="Select source"
      />
      <Select
        id="transactionCategory"
        label="Category"
        :options="budgetCategories"
        v-model="categoryId"
        displayKey="name"
        valueKey="id"
        placeholder="Select category"
      />

      <div class="actions">
        <Button label="Close" :isFlat="true" @click="closeModal" />
        <Button label="Save" type="submit" :isDisabled="!canSubmit" />
      </div>
    </form>
  </div>
</template>

<script>
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Datepicker from "@/components/Datepicker";
import RadioButton from "@/components/RadioButton";
import { mapGetters } from "vuex";
import M from "materialize-css";

export default {
  name: "AddTransaction",
  data() {
    return {
      isExpense: "",
      name: "",
      amount: "",
      budgetId: "",
      sourceId: "",
      categoryId: "",
      date: null,
    };
  },
  components: {
    TextInput,
    Button,
    Select,
    Datepicker,
    RadioButton,
  },
  computed: {
    ...mapGetters(["budgets", "budgetSources", "budgetCategories", "user"]),
    // categories: function() {
    //   return [
    //     {
    //       id: 1,
    //       name: "Groceries",
    //     },
    //     {
    //       id: 2,
    //       name: "Transportation",
    //     },
    //     {
    //       id: 3,
    //       name: "Bills",
    //     },
    //   ];
    // },
    canSubmit: function() {
      return (
        this.amount != 0 &&
        this.budgetId &&
        this.categoryId &&
        this.date &&
        this.isExpense &&
        this.name.length > 2 &&
        this.sourceId
      );
    },
    accessSources: function() {
      return this.budgetSources.filter((source) =>
        source.usersWithAccess.includes(this.user.id)
      );
    },
  },
  watch: {
    budgetId: function(value) {
      const newBudgetId = parseInt(value);
      this.$store.commit(
        "updateSelectedBudget",
        this.budgets.find((budget) => budget.id === newBudgetId)
      );
      this.$store.dispatch("getBudgetSources", newBudgetId).catch((err) => {
        M.toast({
          html: err.response.data.message
            ? err.response.data.message
            : "Something went wrong",
        });
      });

      this.$store
        .dispatch("getBudgetCollaborators", newBudgetId)
        .catch((err) => {
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
      this.$store.dispatch("getBudgetCategories", newBudgetId).catch((err) => {
        M.toast({
          html: err.response.data.message
            ? err.response.data.message
            : "Something went wrong",
        });
      });
    },
  },
  methods: {
    submit: function() {
      if (this.canSubmit) {
        this.$store
          .dispatch("addTransaction", {
            name: this.name,
            sourceId: parseInt(this.sourceId),
            containerId: parseInt(this.budgetId),
            categoryId: parseInt(this.categoryId),
            isExpense: this.isExpense === "false" ? false : true,
            date: this.date,
            amount: parseFloat(this.amount),
          })
          .then(() => {
            this.closeModal();
          })
          .catch((err) => {
            M.toast({
              html: err.response.data.message
                ? err.response.data.message
                : "Something went wrong",
            });
          });
      }
    },
    closeModal: function() {
      this.$store.commit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped>
#addTransactionPopup {
  padding: 7.5% 7.5% 0 7.5%;
  position: absolute;
  width: 90%;
  left: 5%;
  top: 10%;
  background: #fafafa;
  box-shadow: 0px 24px 38px rgba(0, 0, 0, 0.14);
  z-index: 1600;

  h5 {
    text-align: center;
    margin-bottom: 64px;
  }

  #transactionContainer {
    margin-top: 32px;
  }

  .actions {
    text-align: right;
    margin-top: 32px;

    > *:last-child {
      margin-right: 0;
    }
  }

  .checkbox-group-title {
    color: #90a4ae;
  }

  label[for="transactionTypeIncome"] {
    margin-left: 32px;
  }
}
</style>
