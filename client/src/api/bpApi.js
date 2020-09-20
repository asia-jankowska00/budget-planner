import axios from 'axios'

const PORT = 8550;
const baseUrl = `http://localhost:${PORT}/api`;

axios.defaults.headers.common['Content-Type'] = 'application/json-patch+json';

const getConfig = () => {
    const token = localStorage.getItem('bpToken');
    return {
        headers: {
            'Authorization': "Bearer " + token
        }
    }
}

export default {
    auth() {
        return {
            register: (userObj) => axios.post(`${baseUrl}/auth/register`, userObj),
            login: (userObj) => axios.post(`${baseUrl}/auth/login`, userObj) 
        }
    },
    currencies() {
        return {
            getAll: () => axios.get(`${baseUrl}/currencies`)
        }
    },
    users() {
        return {
            getProfile: () => axios.get(`${baseUrl}/profile`, getConfig()),
            updateProfile: (userObj) => axios.patch(`${baseUrl}/profile`, userObj, getConfig())
        }
    },
    sources() {
        return {
            add: (source) => axios.post(`${baseUrl}/sources`, source, getConfig()),
            getAll: () => axios.get(`${baseUrl}/sources`, getConfig()),
        }
    }
}