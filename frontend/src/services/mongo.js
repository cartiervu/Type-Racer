import axios from "axios";

let BASE_URL = "";
if (process.env === "development") {
  BASE_URL = "http://localhost:3001/.netlify/functions/server";
} else {
  BASE_URL =
    "https://ephemeral-piroshki-b7f5cb.netlify.app/.netlify/functions/server";
}

const quoteScoreUrl = `${BASE_URL}/api/userscores/quote`;
const timeScoreUrl = `${BASE_URL}/api/userscores/time`;
const words30ScoreUrl = `${BASE_URL}/api/userscores/score30`;
const stringUrl = `${BASE_URL}/api/strings`;
const wordUrl = `${BASE_URL}/api/words`;

// ******************************
// * Userscores
const getQuoteScores = () => {
  const request = axios.get(quoteScoreUrl);
  return request.then((response) => response.data);
};

const getTimeScores = () => {
  const request = axios.get(timeScoreUrl);
  return request.then((response) => response.data);
};

const getWords30Scores = () => {
  const request = axios.get(words30ScoreUrl);
  return request.then((response) => response.data);
};

const createQuoteScore = (newObject) => {
  const request = axios.post(quoteScoreUrl, newObject);
  return request.then((response) => response.data);
};

const createTimeScore = (newObject) => {
  const request = axios.post(timeScoreUrl, newObject);
  return request.then((response) => response.data);
};

const createWords30Score = (newObject) => {
  const request = axios.post(words30ScoreUrl, newObject);
  return request.then((response) => response.data);
};

const pruneQuoteDatabase = () => {
  const request = axios.delete(quoteScoreUrl);
  return request.then((response) => response.data);
};

const pruneTimeDatabase = () => {
  const request = axios.delete(timeScoreUrl);
  return request.then((response) => response.data);
};

const pruneWords30Database = () => {
  const request = axios.delete(words30ScoreUrl);
  return request.then((response) => response.data);
};

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
  const request = axios.get(stringUrl);
  return request.then((response) => response.data);
};

// ******************************
// * Words
const getWords = (num_words) => {
  const request = axios.get(`${wordUrl}/${num_words}`);
  return request.then((response) => response.data);
};

export default {
  getQuoteScores,
  getTimeScores,
  getWords30Scores,
  createQuoteScore,
  createTimeScore,
  createWords30Score,
  pruneQuoteDatabase,
  pruneTimeDatabase,
  pruneWords30Database,
  getAQuote,
  getWords,
};
