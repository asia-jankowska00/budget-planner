import bpApi from "../../api/bpApi";

const state = () => ({
  sourceTransactions: null,
  isLoadingSourceTransactions: true,
  budgetTransactions: null,
  isLoadingBudgetTransactions: true,
});

// getters
const getters = {
  sourceTransactions: (state) => state.sourceTransactions,
  isLoadingSourceTransactions: (state) => state.isLoadingSourceTransactions,
  budgetTransactions: (state) => state.budgetTransactions,
  isLoadingBudgetTransactions: (state) => state.isLoadingBudgetTransactions,
};

// actions
const actions = {
  getSourceTransactions({ commit }, sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          commit("updateSourceTransactionLoading", true);
          const { data } = await bpApi.sources(sourceId).getAllTransactions();
          commit("updateSourceTransactions", data);
          commit("updateSourceTransactionLoading", false);
          resolve(data);
        } catch (err) {
          commit("updateSourceTransactions", []);
          commit("updateSourceTransactionLoading", false);
          reject(err);
        }
      })();
    });
  },
  getBudgetTransactions({ commit }, budgetId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          commit("updateBudgetTransactionLoading", true);
          const { data } = await bpApi.budgets(budgetId).getAllTransactions();
          commit("updateBudgetTransactions", data);
          commit("updateBudgetTransactionLoading", false);
          resolve(data);
        } catch (err) {
          commit("updateBudgetTransactions", []);
          commit("updateBudgetTransactionLoading", false);
          reject(err);
        }
      })();
    });
  },
  addTransaction({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { data } = await bpApi.transactions().add(payload);
          if (state.selectedSource === payload.sourceId) {
            commit("addSourceTransaction", data);
          }
          if (state.selectedBudget === payload.budgetId) {
            commit("addBudgetTransaction", data);
          }
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
  addBudgetTransaction: (state, transaction) =>
    (state.budgetTransactions = [transaction, ...state.budgetTransactions]),
  addSourceTransaction: (state, transaction) =>
    (state.sourceTransactions = [transaction, ...state.sourceTransactions]),
  updateSourceTransactions: (state, transactions) =>
    (state.sourceTransactions = transactions),
  updateSourceTransactionLoading: (state, isLoading) =>
    (state.isLoadingSourceTransactions = isLoading),
  updateBudgetTransactions: (state, transactions) =>
    (state.budgetTransactions = transactions),
  updateBudgetTransactionLoading: (state, isLoading) =>
    (state.isLoadingBudgetTransactions = isLoading),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
