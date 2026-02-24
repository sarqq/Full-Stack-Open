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

// TODO: päivitys

// 2.14: poisto
const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then((response) => response.data)
}

export default {
    getEntry: getEntry,
    getAll: getAll,
    create: create,
    delete: del
}