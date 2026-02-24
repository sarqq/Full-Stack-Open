/* 2.13 service CRUD-operaatioille */
import axios from 'axios'

const baseUrl = "http://localhost:3001/persons"

// lisäys
const create = newEntry => {
    return axios.post(baseUrl, newEntry)
}

// haku
const read = () => {
    return axios.get(baseUrl)
}

export default {
    read: read,
    create: create
}