import bpApi from '../../api/bpApi';

// initial state
const state = () => ({
  sources: [],
  selectedSource: null
})

// getters
const getters = {
  sources: state => state.sources,
  selectedSource: state => state.selectedSource
}

// actions
const actions = {
  addSource({commit}, payload) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
              const { data } = await bpApi.sources().add(payload);
              commit('addSource', data);
              commit('updateSelectedSource', data)
              resolve();
          } catch (err) {
              reject(err);
          }
      })();
    })
  },
  getAllSources({commit}) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            const { data } = await bpApi.sources().getAll();
            commit('updateSources', data);
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
  updateSelectedSource: (state, selectedSource) => state.selectedSource = selectedSource,
  updateSources: (state, sources) => state.sources = sources,
  addSource: (state, newSource) => state.sources.push(newSource)
}

export default {
  state,
  getters,
  actions,
  mutations
}