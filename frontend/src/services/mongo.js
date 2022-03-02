import axios from 'axios'

const scoreUrl = "/api/userscores"
const stringUrl = "/api/strings"
const wordUrl = "/api/words"


// ******************************
// * Userscores
const getAllScores = () => {
    const request = axios.get(scoreUrl)
    return request.then(response => response.data)
}

const createScore = newObject => {
    const request = axios.post(scoreUrl, newObject)
    return request.then(response => response.data)
}

const pruneDatabase = () => {
    const request = axios.delete(scoreUrl)
    return request.then(response => response.data)
} 

// const updateIndividualScore = (id, newObject) => {
//     const request = axios.put(`${scoreUrl}/${id}`, newObject)
//     return request.then(response => response.data)
// }

// const deleteIndividualScore = (id) => {
//     const request = axios.delete(`${scoreUrl}/${id}`)
//     return request.then(response => response.status)
// }

// ******************************
// * Quotes
const getAQuote = () => {
    const request = axios.get(stringUrl)
    return request.then(response => response.data)
}

// ******************************
// * Words
const getWords = (num_words) => {
    const request = axios.get(`${wordUrl}/${num_words}`)
    return request.then(response => response.data)
}


export default { getAllScores,
    createScore,
    // updateIndividualScore,
    // deleteIndividualScore,
    pruneDatabase,
    getAQuote,
    getWords }