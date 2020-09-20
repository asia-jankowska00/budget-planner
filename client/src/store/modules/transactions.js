import bpApi from '../../api/bpApi';

const state = () => ({
  transactions: null,
  isLoadingTransactions: true,
})

// getters
const getters = {
  transactions: state => state.transactions,
  isLoadingTransactions: state => state.isLoadingTransactions
}

// actions
const actions = {
  getSourceTransactions({commit}, sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            commit('updateTransactionLoading', true)
            const { data } = await bpApi.sources(sourceId).getAllTransactions();
            commit('updateTransactions', data);
            commit('updateTransactionLoading', false)
            resolve(data);
          } catch (err) {
            commit('updateTransactions', []);
            commit('updateTransactionLoading', false)
            reject(err);
          }
      })();
    })
  }
}

// mutations
const mutations = {
  updateTransactions: (state, transactions) => state.transactions = transactions,
  updateTransactionLoading: (state, isLoading) => state.isLoadingTransactions = isLoading
}

export default {
  state,
  getters,
  actions,
  mutations
}