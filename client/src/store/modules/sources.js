// initial state
const state = () => ({
    sources: [
        { id: 1, name: 'Cash'},
        { id: 2, name: 'SparNord'},
        { id: 3, name: 'Vacation'},
    ],
    selectedSource: { id: 2, name: 'SparNord'}
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