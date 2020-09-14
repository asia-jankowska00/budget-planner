import axios from 'axios'

const PORT = 8550;
const baseUrl = `http://localhost:${PORT}/api`;
const token = localStorage.getItem('bpToken');

axios.defaults.headers.common['Content-Type'] = 'application/json-patch+json';
axios.defaults.headers.common['Authorization'] = "Bearer " + token;

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
            getProfile: () => axios.get(`${baseUrl}/profile`)
        }
    },
    sources() {
        return {
            add: (source) => axios.post(`${baseUrl}/sources`, source) 
        }
    }
}