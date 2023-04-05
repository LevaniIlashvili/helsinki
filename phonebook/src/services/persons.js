import axios from "axios";

const baseUrl = "api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data);
};

const deleteObj = (id) => {
  axios.delete(`${baseUrl}/${id}`);
};

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data);
};

// eslint-disable-next-line
export default { getAll, create, deleteObj, update };
