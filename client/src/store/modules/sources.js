import bpApi from '../../api/bpApi';

// initial state
const state = () => ({
  sources: [],
  selectedSource: { id: 2, name: 'SparNord' }
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
              commit('updateSources', data);
              resolve();
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
  updateSources: (state, newSource) => state.sources.push(newSource)
}

export default {
  state,
  getters,
  actions,
  mutations
}