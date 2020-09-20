import bpApi from '../../api/bpApi';

const state = () => ({
  transactions: null
})

// getters
const getters = {
  transactions: state => state.transactions
}

// actions
const actions = {
  getSourceTransactions({commit}, sourceId) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            const { data } = await bpApi.sources(sourceId).getAllTransactions();
            commit('updateTransactions', data);
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
  updateTransactions: (state, transactions) => state.transactions = transactions
}

export default {
  state,
  getters,
  actions,
  mutations
}