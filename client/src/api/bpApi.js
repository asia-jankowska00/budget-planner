import axios from "axios";

// const PORT = 8550;
const baseUrl = `https://budget-planner-dev.herokuapp.com/api`;

axios.defaults.headers.common["Content-Type"] = "application/json-patch+json";

const getConfig = () => {
  const token = localStorage.getItem("bpToken");
  return {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};

export default {
  auth() {
    return {
      register: (userObj) => axios.post(`${baseUrl}/auth/register`, userObj),
      login: (userObj) => axios.post(`${baseUrl}/auth/login`, userObj),
    };
  },
  currencies() {
    return {
      getAll: () => axios.get(`${baseUrl}/currencies`),
    };
  },
  users() {
    return {
      getProfile: () => axios.get(`${baseUrl}/profile`, getConfig()),
      updateProfile: (userObj) => axios.patch(`${baseUrl}/profile`, userObj, getConfig()),
      deleteProfile: () => axios.delete(`${baseUrl}/profile`, getConfig()),
      search: (username) => axios.get(`${baseUrl}/users?username=${username}`, getConfig()),
    };
  },
  sources(sourceId) {
    return {
      add: (source) => axios.post(`${baseUrl}/sources`, source, getConfig()),
      getAll: () => axios.get(`${baseUrl}/sources`, getConfig()),
      getAllTransactions: () => axios.get(`${baseUrl}/sources/${sourceId}/transactions`, getConfig()),
      update: (sourceData) => axios.patch(`${baseUrl}/sources/${sourceId}`, sourceData, getConfig()),
    };
  },
  budgets(containerId) {
    return {
      add: (container) => axios.post(`${baseUrl}/containers`, container, getConfig()),
      getAll: () => axios.get(`${baseUrl}/containers`, getConfig()),
      get: () => axios.get(`${baseUrl}/containers/${containerId}`, getConfig()),
      getCategories: () => axios.get(`${baseUrl}/containers/${containerId}/categories`, getConfig()),
      getSources: () => axios.get(`${baseUrl}/containers/${containerId}/sources`, getConfig()),
      getCollaborators: () => axios.get(`${baseUrl}/containers/${containerId}/collaborators`, getConfig()),
      addCollaborator: (collaborator) => axios.post( `${baseUrl}/containers/${containerId}/collaborators`, collaborator, getConfig()),
      getAllTransactions: () => axios.get(`${baseUrl}/containers/${containerId}/transactions`, getConfig()),
      update: (payload) => axios.patch(`${baseUrl}/containers/${containerId}`, payload, getConfig()),
      delete: () => axios.delete(`${baseUrl}/containers/${containerId}`, getConfig())
    };
  },
  transactions() {
    return {
      add: (transaction) =>
        axios.post(`${baseUrl}/transactions`, transaction, getConfig()),
    };
  },
};
