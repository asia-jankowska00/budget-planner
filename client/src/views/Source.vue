<template>
  <div
    id="sources"
    class="content-wrapper"
    v-if="sources.length > 0 && selectedSource"
  >
    <Select
      id="mainSource"
      label="Your sources"
      :options="sources"
      v-model="selectedSourceId"
      displayKey="name"
      valueKey="id"
    />

    <TransactionsGrid
      v-if="transactions && !isLoadingTransactions"
      :transactions="transactions"
      :currency="selectedSource.currency"
    />

    <p v-else-if="isLoadingTransactions">Loading transactions...</p>
  </div>
  <div v-else class="empty-view">Looks like you don't have any sources.</div>
</template>

<script>
import Select from "@/components/Select";
import TransactionsGrid from "@/components/TransactionsGrid";
import { mapGetters, mapActions } from "vuex";
import M from "materialize-css";

export default {
  name: "Source",
  components: {
    Select,
    TransactionsGrid,
  },
  methods: {
    ...mapActions(["updateSelectedSource"]),
  },
  computed: {
    ...mapGetters(["sources", "selectedSource", "transactions", 'isLoadingTransactions']),
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
}
</style>
