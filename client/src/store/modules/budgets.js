// initial state
const state = () => ({
    budgets: [
        { id: 1, name: 'Private'},
        { id: 2, name: 'Shared budget'}
    ]
})

// getters
const getters = {
    budgets: state => state.budgets
}

// actions
const actions = {
}

// mutations
const mutations = {
}

export default {
    state,
    getters,
    actions,
    mutations
}