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

    <!-- <p class="section-title">Balance</p> -->
    <h4 id="amount" class="primary">
      {{format(selectedSource.currency.code, selectedSource.amount, true)}} 
    </h4>
    <p 
      id="convertedAmount" 
      class="light-primary" 
      v-if="selectedSource.convertedAmount && selectedSource.currency.id !== user.currency.id">
        ~ {{format(user.currency.code, selectedSource.convertedAmount, true)}}
    </p>

    <TransactionsGrid
      v-if="sourceTransactions && !isLoadingSourceTransactions"
      :transactions="sourceTransactions"
      :currency="selectedSource.currency"
    />

    <Loader v-else-if="isLoadingSourceTransactions" text="Loading transactions" :isSmall="true"/>
  </div>
  <div v-else-if="sources.length === 0" class="empty-view">Looks like you don't have any sources.</div>
</template>

<script>
import Select from "@/components/Select";
import Loader from "@/components/Loader";
import TransactionsGrid from "@/components/TransactionsGrid";
import { mapGetters } from "vuex";
import M from "materialize-css";
import formatter from '../helpers/formatter';

export default {
  name: "Source",
  components: {
    Select,
    TransactionsGrid,
    Loader
  },
  methods: {
    format(code, amount, showSymbol) {
      return formatter.formatAmount(code, amount, showSymbol);
    }
  },
  computed: {
    ...mapGetters(["sources", "selectedSource", "sourceTransactions", 'isLoadingSourceTransactions', 'user']),
    selectedSourceId: {
      get () {
        return this.selectedSource.id
      },
      set (value) {
        const newSourceId = parseInt(value)
        this.$store.commit('updateSelectedSource', this.sources.find(source => source.id === newSourceId))
      }
    }
  },
  created() {
    if (!this.sourceTransactions && this.selectedSource) {
      this.$store.dispatch("getSourceTransactions", this.selectedSource.id)
      .catch((err) => {
        M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
      });
    }
  },
  watch: {
    selectedSource: function(source) {
      if (source) {
        this.$store.dispatch("getSourceTransactions", source.id)
        .catch((err) => {
          M.toast({ html: err.response.data.message ? err.response.data.message : "Something went wrong" });
        });
      }
    }
  }
};
</script>

<style lang="scss">
.content-wrapper {
  height: calc(100% - 116px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 8px;
  padding: 0 5%;

  #mainSource,
  #mainBudget {
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
