import axios from 'axios'

const baseUrl = "/api/userscores"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

// const updateIndividualScore = (id, newObject) => {
//     const request = axios.put(`${baseUrl}/${id}`, newObject)
//     return request.then(response => response.data)
// }

// const deleteIndividualScore = (id) => {
//     const request = axios.delete(`${baseUrl}/${id}`)
//     return request.then(response => response.status)
// }

const pruneDatabase = () => {
    const request = axios.delete(baseUrl)
    return request.then(response => response.data)
} 

export default {getAll, create, updateIndividualScore, deleteIndividualScore, pruneDatabase}