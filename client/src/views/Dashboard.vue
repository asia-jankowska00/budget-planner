<template>
  <div id="dashboard" v-if="user">
    <Panel :user="user" />
    <Tabs :canGoBack="canGoBack" />
    <FloatAction v-if="!canGoBack" />
    <AddSource v-if="isModalOpen && modalName === 'addSource'" />
    <AddBudget v-if="isModalOpen && modalName === 'addBudget'" />
    <div id="mask" v-if="isModalOpen"></div>

    <router-view :user="user"></router-view>
  </div>

  <Loader v-else-if="!user && isLoading"/>

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
import Loader from "@/components/Loader";
import M from "materialize-css";
import { mapGetters } from "vuex";

const checkRoute = function(context) {
  const url = window.location.href;
  const hasSlash = url[url.length - 1] === "/" ? true : false;
  const dashboardPath = hasSlash ? "/dashboard/" : "/dashboard";

  if (url.length - dashboardPath.length === url.indexOf(dashboardPath)) {
    console.log(
      "%c Dashboard - redirecting to sources",
      "color: yellowgreen; background-color: black"
    );
    context.$router.push({ path: "dashboard/sources" });
  }
};

export default {
  name: "Dashboard",
  components: {
    Panel,
    Tabs,
    FloatAction,
    AddSource,
    AddBudget,
    Loader,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  watch: {
    $route() {
      checkRoute();
    },
  },
  beforeCreate: function() {
    console.log(
      "%c Dashboard - beforeCreate - Need to check token from now on",
      "color: yellow; background-color: black"
    );
    checkRoute(this);
  },
  computed: {
    ...mapGetters(["isModalOpen", "modalName", "user", "currencies"]),
    canGoBack: function() {
      const lastMatch = this.$route.matched[
        this.$route.matched.length - 1
      ].name.toLowerCase();
      return lastMatch !== "sources" && lastMatch !== "budgets";
    },
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
  },
  created() {
    if (!this.user) {
      this.$store
        .dispatch("getProfile")
        .then(() => (this.isLoading = false))
        .catch((err) => {
          this.isLoading = false;
          M.toast({
            html: err.response.data.message
              ? err.response.data.message
              : "Something went wrong",
          });
        });
    }

    if (this.currencies.length === 0) {
      this.$store.dispatch("getCurrencies").catch((err) => {
        M.toast({
          html: err.response.data.message
            ? err.response.data.message
            : "Something went wrong",
        });
      });
    }
  },
  updated() {
    const tabs = M.Tabs.init(document.querySelector("ul.tabs"));
    if (tabs) {
      tabs.updateTabIndicator();
      document.querySelector(".router-link-active").blur();
    }
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
