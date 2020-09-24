import bpApi from '../../api/bpApi';

// initial state
const state = () => ({
  sources: [],
  selectedSource: null,
  isUpdatingSource: false,
})

// getters
const getters = {
  sources: state => state.sources,
  selectedSource: state => state.selectedSource,
  isUpdatingSource: state => state.isUpdatingSource
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
  },
  updateSource({commit}, payload) {
    return new Promise((resolve, reject) => {
      (async () => {
          try {
            commit('changeUpdatingState', true)
            const { data } = await bpApi.sources(payload.sourceId).update(payload.sourceData);
            commit('updateSource', data);
            commit('updateSelectedSource', data)
            commit('changeUpdatingState', false)
            resolve();
          } catch (err) {
            commit('changeUpdatingState', true)
            reject(err);
          }
      })();
    })
  },
}

// mutations
const mutations = {
  updateSelectedSource: (state, selectedSource) => state.selectedSource = selectedSource,
  updateSources: (state, sources) => state.sources = sources,
  updateSource: (state, source) => state.sources = state.sources.map(s => s.id === source.id ? source : s),
  addSource: (state, newSource) => state.sources.push(newSource),
  changeUpdatingState: (state, isUpdatingSource) => state.isUpdatingSource = isUpdatingSource 
}

export default {
  state,
  getters,
  actions,
  mutations
}