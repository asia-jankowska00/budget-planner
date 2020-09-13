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
}

// mutations
const mutations = {
  updateSelectedSource: (state, selectedSource) => state.selectedSource = selectedSource
}

export default {
  state,
  getters,
  actions,
  mutations
}