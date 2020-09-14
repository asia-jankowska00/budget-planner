<template>
  <div id="addSourcePopup">
    <form @submit.prevent="submit" class="row" autocomplete="off">
      <h5>Add source</h5>
      <TextInput v-model="name" label="Name" type="text" id="sourceName" />
      <TextInput
        v-model="description"
        label="Description"
        type="text"
        id="sourceDescription"
      />
      <TextInput
        v-model="amount"
        label="Initial amount"
        type="number"
        id="sourceAmount"
        min="0"
        step="0.01"
      />
      <Select
        v-model="currencyId"
        :options="currencies"
        label="Currency"
        placeholder="Select currency"
        valueKey="id"
        displayKey="name"
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
import Select from "@/components/Select";
import Button from "@/components/Button";
import { mapGetters } from "vuex";
import M from "materialize-css";

export default {
  name: "AddSource",
  data() {
    return {
      name: "",
      amount: "",
      currencyId: "",
      description: "",
    };
  },
  components: {
    TextInput,
    Select,
    Button,
  },
  computed: {
    ...mapGetters(["currencies"]),
    canSubmit: function() {
      return (
        this.name.length > 1 &&
        this.amount !== "" &&
        this.currencyId !== ""
      );
    },
  },
  methods: {
    submit: function() {
      if (this.canSubmit) {
          this.$store
          .dispatch("addSource", {
            name: this.name,
            amount: this.amount,
            description: this.description,
            currencyId: parseInt(this.currencyId),
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
  created() {
    if (this.currencies) {
      this.$store.dispatch("getCurrencies").catch((err) => {
        M.toast({
          html: err.response.data.message
            ? err.response.data.message
            : "Something went wrong",
        });
      });
    }
  },
};
</script>

<style lang="scss">
#addSourcePopup {
  padding: 7.5%;
  position: absolute;
  width: 90%;
  left: 5%;
  top: 15%;
  background: #fafafa;
  box-shadow: 0px 24px 38px rgba(0, 0, 0, 0.14);
  z-index: 1600;

  h5 {
    text-align: center;
    margin-bottom: 64px;
  }

  .actions {
    text-align: right;
    margin-top: 64px;

    > *:last-child {
      margin-right: 0;
    }
  }

  .dropdown-content {
    height: 260px;
  }
}
</style>
