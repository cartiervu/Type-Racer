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
  const [mode, setMode] = useState({type: 'words', length: 2});
  const [isStarted, setIsStarted] = useState({start: null});
  
 
  useEffect(() => {
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

    // Get scores from DB
    mongoService
    .getAllScores()
    .then(initialScores => {
      setScores(initialScores)
    })
    
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
      <button onClick={() => handleModeChange('words', 2)}>Words </button>
      <button onClick={() => handleModeChange('words', 3)}>Words 3</button>
      <button onClick={() => handleModeChange('words', 5)}>Words 5</button>
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
