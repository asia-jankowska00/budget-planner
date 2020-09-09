// initial state
const state = () => ({
    modalName: '',
    isModalOpen: false
})

// getters
const getters = {
    isModalOpen: state => state.isModalOpen,
    modalName: state => state.modalName
}

// actions
const actions = {
}

// mutations
const mutations = {
    openModal: (state, payload) => {
        state.isModalOpen = true
        state.modalName = payload.name
    },
    closeModal: (state) => {
        state.modalName = '';
        state.isModalOpen = false;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}