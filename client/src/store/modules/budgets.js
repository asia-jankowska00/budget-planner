import bpApi from '../../api/bpApi';

const state = () => ({
  budgets: [],
  selectedBudget: null,
  budgetSources: null,
  budgetCollaborators: null
})

// getters
const getters = {
  budgets: state => state.budgets,
  selectedBudget: state => state.selectedBudget,
  budgetSources: state => state.budgetSources,
  budgetCollaborators: state => state.budgetCollaborators
}

// actions
const actions = {
  getAllBudgets({commit}) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            const { data } = await bpApi.budgets().getAll();
            commit('updateBudgets', data);
            resolve(data);
          } catch (err) {
            reject(err);
          }
      })();
    })
  },
  getBudgetSources({commit}, budgetId) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            const { data } = await bpApi.budgets(budgetId).getSources()
            commit('updateBudgetSources', data);
            resolve(data);
          } catch (err) {
            reject(err);
          }
      })();
    })
  },
  getBudgetCollaborators({commit}, budgetId) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            const { data } = await bpApi.budgets(budgetId).getCollaborators()
            commit('updateBudgetCollaborators', data);
            resolve(data);
          } catch (err) {
            reject(err);
          }
      })();
    })
  }
}

// mutations
const mutations = {
  updateSelectedBudget: (state, selectedBudget) => state.selectedBudget = selectedBudget,
  updateBudgets: (state, budgets) => state.budgets = budgets,
  updateBudgetSources: (state, sources) => state.budgetSources = sources,
  updateBudgetCollaborators: (state, collaborators) => state.budgetCollaborators = collaborators
}

export default {
  state,
  getters,
  actions,
  mutations
}