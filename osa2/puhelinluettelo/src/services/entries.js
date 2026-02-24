/* 2.13: service CRUD-operaatioille */
import axios from 'axios'

const baseUrl = "http://localhost:3001/persons"

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
    return axios.put(`${baseUrl}/${id}`, newValue).then((response) => response.data)
}

// 2.14: poisto
const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then((response) => response.data)
}

export default {
    getEntry: getEntry,
    getAll: getAll,
    update: update,
    create: create,
    delete: del
}