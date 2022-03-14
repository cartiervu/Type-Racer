import axios from 'axios'

const wpmScoreUrl = "/api/userscores/wpm"
const words15ScoreUrl = "api/userscores/score15"
const stringUrl = "/api/strings"
const wordUrl = "/api/words"


// ******************************
// * Userscores
const getWPMScores = () => {
    const request = axios.get(wpmScoreUrl)
    return request.then(response => response.data)
}

const getWords15Scores = () => {
    const request = axios.get(words15ScoreUrl)
    return request.then(response => response.data)
}

const createWPMScore = newObject => {
    const request = axios.post(wpmScoreUrl, newObject)
    return request.then(response => response.data)
}

const createWords15Score = newObject => {
    const request = axios.post(words15ScoreUrl, newObject)
    return request.then(response => response.data)
}


const pruneWPMDatabase = () => {
    const request = axios.delete(wpmScoreUrl)
    return request.then(response => response.data)
} 

const pruneWords15Database = () => {
    const request = axios.delete(words15ScoreUrl)
    return request.then(response => response.data)
} 

// const updateIndividualScore = (id, newObject) => {
//     const request = axios.put(`${wpmScoreUrl}/${id}`, newObject)
//     return request.then(response => response.data)
// }

// const deleteIndividualScore = (id) => {
//     const request = axios.delete(`${wpmScoreUrl}/${id}`)
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


export default { getWPMScores,
    getWords15Scores,
    createWPMScore,
    createWords15Score,
    pruneWPMDatabase,
    pruneWords15Database,
    getAQuote,
    getWords }