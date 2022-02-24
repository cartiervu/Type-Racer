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

export default function App({ words }) {
  const [quoteObj, setQuoteObj] = useState({array: [""], currIndex: 0});
  const [timeSplits, setTimeSplits] = useState([]);
  const [timer, setTimer] = useState({
    startTime: null,
    endTime: null
  });
  const [active, setActive] = useState(true);
  const [scores, setScores] = useState('');
  const [mode, setMode] = useState({type: 'words', length: 15});
  const [isStarted, setIsStarted] = useState({start: null});
  
  // Wikipedia API - get description from wikipedia
  useEffect(() => {
    // getRandomWikiPage()
    //   .then(response => setQuoteObj(response))
    setTimer({startTime: null, endTime: null});
    const shuffledWord = _.shuffle(words.slice(0, 100));
    const newQuote = {
      array: (shuffledWord.slice(0, mode.length)).map(word => word + " "),
      currIndex: 0
    };
    newQuote.array[newQuote.array.length - 1] = newQuote.array[newQuote.array.length - 1].trim();
    setQuoteObj(newQuote);
    document.getElementById("text-area").focus();
  }, [active, mode]);

  // MongoDB API - get scores from DB
  useEffect(() => {
    mongoService
    .getAll()
    .then(initialScores => {
      setScores(initialScores)
    })
  }, [active])

  const handleOnFinish = () => {
    const newTimer = {
      ...timer,
      endTime: performance.now(),
    };
    setTimer(newTimer);
  }

  const handleRetryButton = () => {
    setIsStarted({start: false});
    setTimer({startTime: null, endTime: null});
    setQuoteObj({array: [""], currIndex: 0});
    setActive(!active);
  }

  const handleModeChange = (type, length) => {
    setIsStarted({start: false});
    setMode({type: type, length: length});
  }

  return (
    <>
      <button onClick={() => handleModeChange('words', 15)}>Words 15</button>
      <button onClick={() => handleModeChange('words', 30)}>Words 30</button>
      <button onClick={() => handleModeChange('words', 45)}>Words 45</button>
      <button onClick={() => handleModeChange('words', 60)}>Words 60</button>
      <button onClick={() => handleModeChange('time', 15)}>Time 15</button>
      <div className="text-container">
        {!timer.endTime 
        ? (
            <Text quoteObj={quoteObj} timer={timer} timeSplits={timeSplits} onFinish={(handleOnFinish)} isStarted={isStarted}/>
          ) 
        : (
            <>
              <DisplayResults scores={scores} quoteObj={quoteObj} timeSplits={timeSplits} timer={timer} api={mongoService}/>
              <button onClick={() => handleRetryButton()}>RETRY</button>
            </>
          )}
      </div>
    </>
  )
}
