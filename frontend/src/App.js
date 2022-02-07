import React, { useState, useEffect } from 'react'
import mongoService from './services/mongo'

import Text from './components/UserText';
import DisplayResults from './components/DisplayResults'

var _ = require('lodash');

async function getRandomWikiPage() {
  const endpoint = `https://simple.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=random&grnnamespace=0&prop=revisions%7Cimages&rvprop=content&grnlimit=25`
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw Error(response.statusText);
  }
  
  const json = await response.json();
  const pages = json.query.pages;

  for (const pageid in pages) {
      let result = await searchWikipedia(pageid);
      result = result.replace(/[^\x00-\x7F]/g, "");
      result = result.replace("  ", " ")
      
      if (result.length > 25 && result.length < 100) {
          return result;
      }
      // return result;
  }
}

async function searchWikipedia(id) {
  const endpoint = `https://simple.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${id}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
      throw Error(response.statusText);
  }
  const json = await response.json();

  return json.query.pages[id].extract;
}

<<<<<<< Updated upstream
export default function App({ words }) {
=======
export default function App({ scores, words }) {
>>>>>>> Stashed changes
  const [quote, setQuote] = useState('');
  const [timer, setTimer] = useState({
    startTime: null,
    endTime: null
  });
  const [active, setActive] = useState(true);
<<<<<<< Updated upstream
  const [scores, setScores] = useState('');
  
=======
>>>>>>> Stashed changes

  // Wikipedia API - get description from wikipedia
  useEffect(() => {
    // getRandomWikiPage()
    //   .then(response => setQuote(response))
    const shuffledWord = _.shuffle(words.slice(0, 100));
    setQuote((shuffledWord.slice(0, 25)).join(' '));
  }, [active]);

  // MongoDB API - get scores from DB
  useEffect(() => {
    mongoService
    .getAll()
    .then(initialScores => {
      setScores(initialScores)
    })
  }, [])

  const handleOnFinish = () => {
    const newTimer = {
      ...timer,
      endTime: performance.now(),
    };
    setTimer(newTimer);
  }

  const handleClick = () => {
    setTimer({startTime: null, endTime: null});
    setQuote('');
    setActive(!active);
  }

  return (
    <div className="text-container">
      {!timer.endTime ? (
        <Text quote={quote} timer={timer} onFinish={(handleOnFinish)}/>
        ) : (
          <>
            <DisplayResults scores={scores} quote={quote} timer={timer}/>
            <button onClick={() => handleClick()}>RETRY</button>
          </>
        )}
    </div>
  )
}
