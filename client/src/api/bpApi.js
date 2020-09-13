import axios from 'axios'

const PORT = 8550;
const baseUrl = `http://localhost:${PORT}/api`;
const token = localStorage.getItem('bpToken');

axios.defaults.headers.post['Content-Type'] = 'application/json-patch+json';
axios.defaults.headers.post['x-auth-token'] = token;

export default {
    auth() {
        return {
            register: (userObj) => axios.post(`${baseUrl}/auth/register`, userObj),
            login: (userObj) => axios.post(`${baseUrl}/auth/login`, userObj) 
        }
    }
}