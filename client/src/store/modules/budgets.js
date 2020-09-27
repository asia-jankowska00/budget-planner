import bpApi from "../../api/bpApi";

const state = () => ({
  budgets: [],
  selectedBudget: null,
  budgetSources: null,
  budgetCollaborators: null,
  budgetCategories: null,
  isBudgetLoadingSources: true,
  isBudgetLoadingCollaborators: true,
});

// getters
const getters = {
  budgets: (state) => state.budgets,
  selectedBudget: (state) => state.selectedBudget,
  budgetSources: (state) => state.budgetSources,
  budgetCollaborators: (state) => state.budgetCollaborators,
  budgetCategories: (state) => state.budgetCategories,
  isBudgetLoadingSources: (state) => state.isBudgetLoadingSources,
  isBudgetLoadingCollaborators: (state) => state.isBudgetLoadingCollaborators,
  searchedCollaborators: (state) => state.searchedCollaborators,
};

// actions
const actions = {
  addBudget({ commit }, payload) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { data } = await bpApi.budgets().add(payload);
          commit("addBudget", data);
          commit("updateSelectedBudget", data);
          resolve();
        } catch (err) {
          reject(err);
        }
      })();
    });
  },
  getAllBudgets({ commit }) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { data } = await bpApi.budgets().getAll();
          commit("updateBudgets", data);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      })();
    });
  },
  getBudgetSources({ commit }, budgetId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          commit("updateBudgetSourcesLoading", true);
          const { data } = await bpApi.budgets(budgetId).getSources();
          commit("updateBudgetSources", data);
          commit("updateBudgetSourcesLoading", false);
          resolve(data);
        } catch (err) {
          commit("updateBudgetSourcesLoading", false);
          reject(err);
        }
      })();
    });
  },
  getBudgetCategories({ commit }, budgetId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { data } = await bpApi.budgets(budgetId).getCategories();
          commit("updateBudgetCategories", data);

          resolve(data);
        } catch (err) {
          reject(err);
        }
      })();
    });
  },
  getBudgetCollaborators({ commit }, budgetId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          commit("updateBudgetCollaboratorsLoading", true);
          const { data } = await bpApi.budgets(budgetId).getCollaborators();
          commit("updateBudgetCollaborators", data);
          commit("updateBudgetCollaboratorsLoading", false);
          resolve(data);
        } catch (err) {
          commit("updateBudgetCollaboratorsLoading", false);
          reject(err);
        }
      })();
    });
  },
  searchCollaborators({ commit }, username) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { data } = await bpApi.users().search(username);
          commit("updateSearchedCollaborators", data);
          resolve();
        } catch (err) {
          commit("updateSearchedCollaborators", []);
          reject(err);
        }
      })();
    });
  },
  addCollaborator({ commit }, payload) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { data } = await bpApi
            .budgets(payload.budgetId)
            .addCollaborator(payload.collaborator);
          console.log(data);
          commit("updateSearchedCollaborators", []);
          commit("updateBudgetCollaborators", data);
          resolve();
        } catch (err) {
          reject(err);
        }
      })();
    });
  },
};

// mutations
const mutations = {
  addBudget: (state, newBudget) => state.budgets.push(newBudget),
  updateSelectedBudget: (state, selectedBudget) =>
    (state.selectedBudget = selectedBudget),
  updateBudgets: (state, budgets) => (state.budgets = budgets),
  updateBudgetSources: (state, sources) => (state.budgetSources = sources),
  updateBudgetCollaborators: (state, collaborators) =>
    (state.budgetCollaborators = collaborators),
  updateBudgetCategories: (state, categories) =>
    (state.budgetCategories = categories),
  updateBudgetSourcesLoading: (state, isLoading) =>
    (state.isBudgetLoadingSources = isLoading),
  updateBudgetCollaboratorsLoading: (state, isLoading) =>
    (state.isBudgetLoadingCollaborators = isLoading),
  updateSearchedCollaborators: (state, users) =>
    (state.searchedCollaborators = users),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
