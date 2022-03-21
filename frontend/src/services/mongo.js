import axios from 'axios'

// const quoteScoreUrl = "https://not-type-racer.herokuapp.com/api/userscores/wpm"
// const timeScoreUrl = "https://not-type-racer.herokuapp.com/api/userscores/score15"
// const words30ScoreUrl = "https://not-type-racer.herokuapp.com/api/userscores/score30"
// const stringUrl = "https://not-type-racer.herokuapp.com/api/strings"
// const wordUrl = "https://not-type-racer.herokuapp.com/api/words"

const quoteScoreUrl = "http://localhost:3001/api/userscores/quote"
const timeScoreUrl = "http://localhost:3001/api/userscores/time"
const words30ScoreUrl = "http://localhost:3001/api/userscores/score30"
const stringUrl = "http://localhost:3001/api/strings"
const wordUrl = "http://localhost:3001/api/words"


// ******************************
// * Userscores
const getQuoteScores = () => {
    const request = axios.get(quoteScoreUrl)
    return request.then(response => response.data)
}

const getTimeScores = () => {
    const request = axios.get(timeScoreUrl)
    return request.then(response => response.data)
}

const getWords30Scores = () => {
    const request = axios.get(words30ScoreUrl)
    return request.then(response => response.data)
}

const createQuoteScore = newObject => {
    const request = axios.post(quoteScoreUrl, newObject)
    return request.then(response => response.data)
}

const createTimeScore = newObject => {
    const request = axios.post(timeScoreUrl, newObject)
    return request.then(response => response.data)
}

const createWords30Score = newObject => {
    const request = axios.post(words30ScoreUrl, newObject)
    return request.then(response => response.data)
}


const pruneQuoteDatabase = () => {
    const request = axios.delete(quoteScoreUrl)
    return request.then(response => response.data)
} 

const pruneTimeDatabase = () => {
    const request = axios.delete(timeScoreUrl)
    return request.then(response => response.data)
} 

const pruneWords30Database = () => {
    const request = axios.delete(words30ScoreUrl)
    return request.then(response => response.data)
} 

// const updateIndividualScore = (id, newObject) => {
//     const request = axios.put(`${quoteScoreUrl}/${id}`, newObject)
//     return request.then(response => response.data)
// }

// const deleteIndividualScore = (id) => {
//     const request = axios.delete(`${quoteScoreUrl}/${id}`)
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


export default { getQuoteScores,
    getTimeScores,
    getWords30Scores,
    createQuoteScore,
    createTimeScore,
    createWords30Score,
    pruneQuoteDatabase,
    pruneTimeDatabase,
    pruneWords30Database,
    getAQuote,
    getWords }