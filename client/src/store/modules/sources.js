// initial state
const state = () => ({
    sources: [
        { id: 1, name: 'Cash'},
        { id: 2, name: 'SparNord'},
        { id: 3, name: 'Vacation'},
    ],
    selectedSource: { id: 2, name: 'SparNord'},
    currencies: [
        {
          "id": 1,
          "code": 'DKK',
          "text": 'Danish Krone'
        },
        {
          "id": 2,
          "code": 'EUR',
          "text": 'Euro'
        },
        {
          "id": 3,
          "code": 'USD',
          "text": 'United States Dollar'
        }
    ]
})

// getters
const getters = {
    sources: state => state.sources,
    currencies: state => state.currencies,
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