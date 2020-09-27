import axios from "axios";

const PORT = 8578;
const baseUrl = `http://localhost:${PORT}/api`;

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
      updateProfile: (userObj) =>
        axios.patch(`${baseUrl}/profile`, userObj, getConfig()),
    };
  },
  sources(sourceId) {
    return {
      add: (source) => axios.post(`${baseUrl}/sources`, source, getConfig()),
      getAll: () => axios.get(`${baseUrl}/sources`, getConfig()),
      getAllTransactions: () =>
        axios.get(`${baseUrl}/sources/${sourceId}/transactions`, getConfig()),
      update: (sourceData) =>
        axios.patch(`${baseUrl}/sources/${sourceId}`, sourceData, getConfig()),
    };
  },
  budgets(containerId) {
    return {
      add: (container) =>
        axios.post(`${baseUrl}/containers`, container, getConfig()),
      getAll: () => axios.get(`${baseUrl}/containers`, getConfig()),
      get: () => axios.get(`${baseUrl}/containers/${containerId}`, getConfig()),
      getSources: () =>
        axios.get(`${baseUrl}/containers/${containerId}/sources`, getConfig()),
      getCollaborators: () =>
        axios.get(
          `${baseUrl}/containers/${containerId}/collaborators`,
          getConfig()
        ),
      getCategories: () =>
        axios.get(
          `${baseUrl}/containers/${containerId}/categories`,
          getConfig()
        ),
      getAllTransactions: () =>
        axios.get(
          `${baseUrl}/containers/${containerId}/transactions`,
          getConfig()
        ),
    };
  },
  transactions() {
    return {
      add: (transaction) =>
        axios.post(`${baseUrl}/transactions`, transaction, getConfig()),
    };
  },
};
