import bpApi from '../../api/bpApi';

const state = () => ({
    budgets: [],
    selectedBudget: null
})

// getters
const getters = {
    budgets: state => state.budgets,
    selectedBudget: state => state.selectedBudget
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
      }
}

// mutations
const mutations = {
    updateSelectedBudget: (state, selectedBudget) => state.selectedBudget = selectedBudget,
    updateBudgets: (state, budgets) => state.budgets = budgets,
}

export default {
    state,
    getters,
    actions,
    mutations
}