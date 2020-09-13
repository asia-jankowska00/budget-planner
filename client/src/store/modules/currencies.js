import bpApi from '../../api/bpApi';

const state = () => ({
    currencies: []
})

// getters
const getters = {
  currencies: store => store.currencies
}

// actions
const actions = {
    getCurrencies({ commit }) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const { data } = await bpApi.currencies().getAll()
                    commit('updateCurrencies', data);
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            })();
        })
    },
}

// mutations
const mutations = {
    updateCurrencies(state, payload) {
      state.currencies = payload
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}