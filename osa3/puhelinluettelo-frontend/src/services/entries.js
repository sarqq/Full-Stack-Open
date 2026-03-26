import axios from 'axios'

const baseUrl = "/api/persons"

// lisäys
const create = newEntry => {
    return axios.post(baseUrl, newEntry)
}

// haku (yksi)
const getEntry = (id) => {
    return axios.get(`${baseUrl}/${id}`)
}

// haku (kaikki)
const getAll = () => {
    return axios.get(baseUrl)
}

// päivitys
const update = (id, newValue) => {
    return axios.put(`${baseUrl}/${id}`, newValue).then(response => response.data)
}

// 2.14: poisto
const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getEntry,
    getAll,
    update,
    create,
    del
}