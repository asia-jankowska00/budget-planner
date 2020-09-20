<template>
  <div v-if="sources.length > 0 && selectedSource" id="sources" class="content-wrapper">
    <Select
      id="mainSource"
      label="Your sources"
      :options="sources"
      v-model="selectedSourceId"
      displayKey="name"
      valueKey="id"
    />

    <p class="section-title">Balance</p>
    <h6 id="amount" class="primary">{{selectedSource.amount.toFixed(2)}} {{selectedSource.currency.symbol}}</h6>
    <p id="convertedAmount" class="light-primary">~ {{selectedSource.convertedAmount.toFixed(2)}} {{user.currency.symbol}}</p>

    <TransactionsGrid
      v-if="transactions && !isLoadingTransactions"
      :transactions="transactions"
      :currency="selectedSource.currency"
    />

    <Loader v-else-if="isLoadingTransactions" text="Loading transactions" :isSmall="true"/>
  </div>
  <div v-else class="empty-view">Looks like you don't have any sources.</div>
</template>

<script>
import Select from "@/components/Select";
import Loader from "@/components/Loader";
import TransactionsGrid from "@/components/TransactionsGrid";
import { mapGetters, mapActions } from "vuex";
import M from "materialize-css";

export default {
  name: "Source",
  components: {
    Select,
    TransactionsGrid,
    Loader
  },
  methods: {
    ...mapActions(["updateSelectedSource"]),
  },
  computed: {
    ...mapGetters(["sources", "selectedSource", "transactions", 'isLoadingTransactions', 'user']),
    selectedSourceId: {
      get () {
        return this.selectedSource.id
      },
      set (value) {
        const newSourceId = parseInt(value)
        this.$store.commit('updateSelectedSource', this.sources.find(source => source.id === newSourceId))
        this.$store.dispatch("getSourceTransactions", newSourceId)
          .catch((err) => {
            M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
          });
      }
    }
  },
  created() {
    this.$store
      .dispatch("getSourceTransactions", this.selectedSource.id)
      .catch((err) => {
        M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
      });
  },
};
</script>

<style lang="scss">
.content-wrapper {
  height: calc(100% - 116px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 8px;
  padding: 0 5%;

  #mainSource {
    width: 50%;

    input {
      border: 0;
    }

    .dropdown-content {
      width: 100%;
    }

    label {
      left: 0;
    }
  }

  #amount {
    font-weight: 600;
    margin-bottom: 0;
  }

  #convertedAmount {
    font-size: 0.9rem;
    margin: 0;
  }
}
</style>
