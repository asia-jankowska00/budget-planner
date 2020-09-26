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
      />
      <Select
        id="transactionSource"
        label="Source"
        :options="sources"
        v-model="sourceId"
        displayKey="name"
        valueKey="id"
      />
      <Select
        id="transactionCategory"
        label="Category"
        :options="categories"
        v-model="categoryId"
        displayKey="name"
        valueKey="id"
      />

      <div class="actions">
        <Button label="Close" :isFlat="true" @click="closeModal" />
        <Button label="Save" type="submit" />
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

export default {
  name: "AddTransaction",
  data() {
    return {
      isExpense: true,
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
    ...mapGetters(["budgets", "sources"]),
    categories: function() {
      return [
        {
          id: 1,
          name: "Groceries",
        },
        {
          id: 2,
          name: "Transportation",
        },
        {
          id: 3,
          name: "Bills",
        },
      ];
    },
  },
  methods: {
    submit: function() {
      alert("transaction submitted");
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
