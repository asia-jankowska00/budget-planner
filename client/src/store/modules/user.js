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
    register({ commit }, payload) {
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
    },
    login({ commit }, payload) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const { data } = await bpApi.auth().login(payload);
                    window.localStorage.setItem('bpToken', data.token)
                    commit('updateUser', data);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })()
        })
    },
    getProfile({commit}) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const { data } = await bpApi.users().getProfile();
                    commit('updateUser', data);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })()
        })
    },
    updateProfile({commit}, payload) {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const { data } = await bpApi.users().updateProfile(payload);
                    commit('updateUser', data);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })()
        })
    },
    deleteProfile() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    await bpApi.users().deleteProfile();
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })()
        })
    }
}

// mutations
const mutations = {
    updateUser(state, payload) {
        const { id, firstName, lastName, username, currency } = payload;
        state.user = {
            id,
            firstName,
            lastName,
            username,
            currency
        }
    },
    clearUser: (state) => state.user = null
}

export default {
    state,
    getters,
    actions,
    mutations
}