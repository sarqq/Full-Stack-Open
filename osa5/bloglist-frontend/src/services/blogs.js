import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// GET
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// POST
const create = async newObject => {
  const config = {
    headers: {Authorization: token}
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// PUT
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// DELETE
const del = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, create, update, setToken, del}