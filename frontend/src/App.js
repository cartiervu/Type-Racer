import React, { useState, useEffect } from 'react'
import mongoService from './services/mongo'

import Text from './components/UserText';
import DisplayResults from './components/DisplayResults'

var _ = require('lodash');

export default function App() {
  const [quoteObj, setQuoteObj] = useState({array: [""], currIndex: 0});
  const [timeSplits, setTimeSplits] = useState([]);
  const [timer, setTimer] = useState({
    startTime: null,
    endTime: null
  });
  const [active, setActive] = useState(true);
  const [scores, setScores] = useState([]);
  const [mode, setMode] = useState({type: 'words', length: 3});
  const [isStarted, setIsStarted] = useState({start: null});
  
 
  useEffect(() => {
    if (mode.type === "words") {
      // Get 15 words to start from the database
      mongoService
      .getWords(mode.length)
      .then(initialWords => {
        setTimer({startTime: null, endTime: null});

        const newQuote = {
          array: initialWords.map(word => word + " "),
          currIndex: 0
        };
        
        newQuote.array[newQuote.array.length - 1] = newQuote.array[newQuote.array.length - 1].trim();
        setQuoteObj(newQuote);
        document.getElementById("text-area").focus();
      })

      
      if (mode.length === 3) {
        // Get scores from DB
        mongoService
        .getWords15Scores()
        .then(initialScores => {
          setScores(initialScores)
        })
      } else if (mode.length === 5) {
        // Get scores from DB
        mongoService
        .getWords30Scores()
        .then(initialScores => {
          setScores(initialScores)
        })
      }
      
    } else if (mode.type === "quote") {
      mongoService
      .getAQuote()
      .then(initialQuote => {
        setTimer({startTime: null, endTime: null});

        let quote = initialQuote[0]["Articles"];
        quote = quote.split(" ")

        const newQuote = {
          array: quote.map(word => word + " "),
          currIndex: 0
        };

        newQuote.array[newQuote.array.length - 1] = newQuote.array[newQuote.array.length - 1].trim();
        setQuoteObj(newQuote);
        document.getElementById("text-area").focus();
      })

      // Get scores from DB
      mongoService
      .getQuoteScores()
      .then(initialScores => {
        setScores(initialScores)
      })
    }

  }, [active, mode]);


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
      <div className="top-bar">
        <button className="top-bar-button" onClick={() => handleModeChange('words', 3)}>Words 15</button>
        <button className="top-bar-button" onClick={() => handleModeChange('words', 5)}>Words 30</button>
        <button className="top-bar-button" onClick={() => handleModeChange('quote', 0)}>Quote</button>
        {/* <button onClick={() => handleModeChange('time', 15)}>Time 15</button> */}
      </div>
      <div className="text-container">
        {!timer.endTime 
        ? (
            <Text quoteObj={quoteObj} timer={timer} timeSplits={timeSplits} onFinish={(handleOnFinish)} isStarted={isStarted}/>
          ) 
        : (
            <>
              <DisplayResults scores={scores} quoteObj={quoteObj} timeSplits={timeSplits} timer={timer} mode={mode} api={mongoService}/>
              <button className="retry-button" onClick={() => handleRetryButton()}>RETRY</button>
            </>
          )}
      </div>
    </>
  )
}
