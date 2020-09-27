<template>
  <div id="dashboard" v-if="user && !isLoading">
    <Panel :user="user" />
    <Tabs :canGoBack="canGoBack" />
    <FloatAction v-if="!canGoBack" />
    <AddSource v-if="isModalOpen && modalName === 'addSource'" />
    <AddBudget v-if="isModalOpen && modalName === 'addBudget'" />
    <AddTransaction v-if="isModalOpen && modalName === 'addTransaction'" />
    <div id="mask" v-if="isModalOpen"></div>

    <router-view :user="user"></router-view>
  </div>

  <Loader v-else-if="isLoading" text="Loading data" />

  <div class="no-data" v-else-if="!user && !isLoading">
    <p>Something went wrong :(</p>
    <a href @click.prevent="goToLogin">Please login again.</a>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import Tabs from "@/components/Tabs";
import FloatAction from "@/components/FloatAction";
import AddSource from "@/components/AddSource";
import AddBudget from "@/components/AddBudget";
import AddTransaction from "@/components/AddTransaction";
import Loader from "@/components/Loader";
import M from "materialize-css";
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Panel,
    Tabs,
    FloatAction,
    AddSource,
    AddBudget,
    AddTransaction,
    Loader,
  },
  data() {
    return {
      isLoadingUser: true,
      isLoadingCurrencies: true,
      isLoadingSources: true,
      isLoadingBudgets: true,
    };
  },
  watch: {
    $route() {
      this.checkRoute();
    },
  },
  computed: {
    ...mapGetters([
      "isModalOpen",
      "modalName",
      "user",
      "currencies",
      "sources",
      "budgets",
      "selectedSource",
      "selectedBudget",
    ]),
    canGoBack: function() {
      const lastMatch = this.$route.matched[
        this.$route.matched.length - 1
      ].name.toLowerCase();
      return lastMatch !== "sources" && lastMatch !== "budgets";
    },
    isLoading: function() {
      return (
        this.isLoadingUser ||
        this.isLoadingSources ||
        this.isLoadingCurrencies ||
        this.isLoadingBudgets
      );
    },
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
    checkRoute() {
      const url = window.location.href;
      const hasSlash = url[url.length - 1] === "/" ? true : false;
      const dashboardPath = hasSlash ? "/dashboard/" : "/dashboard";

      if (url.length - dashboardPath.length === url.indexOf(dashboardPath)) {
        console.log(
          "%c Dashboard - redirecting to sources",
          "color: yellowgreen; background-color: black"
        );
        this.$router.push({ path: "dashboard/sources" });
      }
    },
    updateIndicator() {
      let indicator = document.querySelector(".indicator");
      if (!indicator) return;

      const newPage = this.$route.name.toLowerCase();

      if (newPage === "sources") {
        indicator.style.left = "0px";
        indicator.style.right = "225px";
      } else if (newPage === "budgets") {
        indicator.style.left = "225px";
        indicator.style.right = "0px";
      }
    },
  },
  created() {
    this.checkRoute(this);

    if (!this.user) {
      this.$store
        .dispatch("getProfile")
        .then(() => (this.isLoadingUser = false))
        .catch((err) => {
          this.isLoadingUser = false;
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    } else {
      this.isLoadingUser = false;
    }

    if (this.currencies.length === 0) {
      this.$store
        .dispatch("getCurrencies")
        .then(() => (this.isLoadingCurrencies = false))
        .catch((err) => {
          this.isLoadingCurrencies = false;
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    } else {
      this.isLoadingCurrencies = false;
    }

    if (this.sources.length === 0) {
      this.$store
        .dispatch("getAllSources")
        .then((data) => {
          if (data && data.length > 0) {
            this.$store.commit("updateSelectedSource", data[0]);
          }

          this.isLoadingSources = false;
        })
        .catch((err) => {
          this.isLoadingSources = false;
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    } else {
      this.isLoadingSources = false;
    }

    if (this.budgets.length === 0) {
      this.$store
        .dispatch("getAllBudgets")
        .then((data) => {
          if (data && data.length > 0) {
            this.$store.commit("updateSelectedBudget", data[0]);
            this.$store.dispatch("getBudgetSources", data[0].id);
          }

          this.isLoadingBudgets = false;
        })
        .catch((err) => {
          this.isLoadingBudgets = false;
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    } else {
      this.isLoadingBudgets = false;
    }

    if (this.budgets.length !== 0) {
      this.$store
        .dispatch("getAllBudgets")
        .then((data) => {
          this.$store.commit("updateSelectedBudget", data[0]);
          this.isLoadingBudgets = false;
        })
        .catch((err) => {
          this.isLoadingBudgets = false;
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    } else {
      this.isLoadingBudgets = false;
    }
  },
  mounted() {
    this.updateIndicator();
  },
  updated() {
    this.updateIndicator();
  },
  beforeDestroy() {
    this.$store.commit("updateSelectedSource", null);
    this.$store.commit("updateSelectedBudget", null);
    this.$store.commit("updateSources", []);
    this.$store.commit("updateBudgets", []);
    this.$store.commit("updateSourceTransactions", null);
    this.$store.commit("updateBudgetTransactions", null);
    this.$store.commit("updateBudgetCollaborators", null);
    this.$store.commit("updateBudgetSources", null);
  },
};
</script>

<style lang="scss" scoped>
#dashboard {
  height: 100%;
  position: relative;

  > .empty-view {
    height: calc(100% - 108px);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #mainCTA {
    position: absolute;
    bottom: 40px;
    right: 2px;
  }

  #mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    left: 0;
    top: 60px;
    width: 100%;
    height: calc(100% - 60px);
    pointer-events: none;
    z-index: 1500;
  }
}

.no-data {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    margin-top: 1rem;
  }
}
</style>
