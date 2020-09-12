import bpApi from '../../api/bpApi';

const state = () => ({
    user: null
})

// getters
const getters = {
    user: store => store.user
}

// actions
const actions = {
    register({commit}, payload) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const { data } = await bpApi.auth().register(payload);
                    window.localStorage.setItem('bpToken', data.token)
                    commit('updateUser', data);
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
    updateUser (state, payload) {
        const {firstName, lastName, username, currency} = payload;
        state.user = {
            firstName,
            lastName,
            username,
            currency
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}