import React, { useState, useEffect, useRef } from 'react'
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
  const [mode, setMode] = useState({type: 'words', length: 30});
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
      } else if (mode.length === 30) {
        // Get scores from DB
        mongoService
        .getWords30Scores()
        .then(initialScores => {
          setScores(initialScores)
        })
      } else if (mode.type === "time") {
        mongoService
        .getWords(120)
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

    // Clear the interval, finalize array for graphinh
    clearInterval(intervalId.current)
    // console.log(chartWordsCompleted)

    // const elapsedTime = ((timer.endTime - timer.startTime) / 1000).toFixed(3);
    // console.log(elapsedTime)
  }

  const handleRetryButton = () => {
    setIsStarted({start: false});
    setTimer({startTime: null, endTime: null});
    setQuoteObj({array: [""], currIndex: 0});
    setActive(!active);

    // Clear the interval, start array over again
    clearInterval(intervalId.current)
    setChartWordsCompleted([]);
  }

  const handleModeChange = (type, length) => {
    setIsStarted({start: false});
    setMode({type: type, length: length});

    // Clear the interval, start array over again
    clearInterval(intervalId.current)
    setChartWordsCompleted([]);
  }

  // An array to hold the number of words completed every 500 ms
  const [chartWordsCompleted, setChartWordsCompleted] = useState([]);
  const intervalId = useRef(null)

  return (
    <>
      <div className="top-bar">
        {/* <button className="top-bar-button" onClick={() => handleModeChange('words', 3)}>Words 15</button> */}
        <button className="top-bar-button" onClick={() => handleModeChange('words', 30)}>Words</button>
        <button className="top-bar-button" onClick={() => handleModeChange('quote', 0)}>Quote</button>
        <button className="top-bar-button" onClick={() => handleModeChange('time', 15)}>Time 15</button>
      </div>
      <div className="text-container">
        {!timer.endTime 
        ? (
            <Text quoteObj={quoteObj} timer={timer} timeSplits={timeSplits} onFinish={(handleOnFinish)} isStarted={isStarted} setChartWordsCompleted={setChartWordsCompleted} intervalId={intervalId} mode={mode}/>
          ) 
        : (
            <>
              <DisplayResults scores={scores} quoteObj={quoteObj} timeSplits={timeSplits} timer={timer} mode={mode} api={mongoService} chartWordsCompleted={chartWordsCompleted}/>
              <button className="retry-button" onClick={() => handleRetryButton()}>RETRY</button>
            </>
          )}
      </div>
    </>
  )
}
