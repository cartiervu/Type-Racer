import React, { useState, useEffect } from 'react'
import DisplayQuote from './DisplayQuote';
import DisplayWordsRemaining from './DisplayWordsRemaining';
import { MemoizedTimer } from './Timer';

export default function UserText({ quoteObj, timer, timeSplits, onFinish, isStarted, mode, setChartWordsCompleted, intervalId }) {
    const [userText, setUserText] = useState('');
    const [startCountdownTimer, setStartCountdownTimer] = useState(false);

    if (!isStarted.start) {
      isStarted.start = true;
      setUserText('');
    }

    const handleKeyPress = (event) => {
      if (!timer.startTime) {
        timer.startTime = performance.now();
        setStartCountdownTimer(true);
      }
      setUserText(event.target.value);
      if (event.target.value === (quoteObj.array[quoteObj.currIndex])) {
        timeSplits.push(performance.now());
        quoteObj.currIndex++;
        setUserText('');
        if (quoteObj.currIndex >= quoteObj.array.length) {
          onFinish();
        }
      }
    }

    useEffect(() => {
      intervalId.current = setInterval(() => {
        if (timer.startTime){
          setChartWordsCompleted(prevArray => [...prevArray,quoteObj.currIndex]);
        }
      }, 500);
  
      return () => clearInterval(intervalId.current);
    }, [quoteObj]);


    return (
      <>
        {mode.type === 'time'
        ? <MemoizedTimer initSeconds={mode.length} isStarted={startCountdownTimer} onFinish={(onFinish)}/> 
        : <DisplayWordsRemaining wordsComplete={quoteObj.currIndex} totalWords={quoteObj.array.length}/>}
        <DisplayQuote quoteObj={quoteObj} userText={userText}/>
        <div id="text-box">
          <textarea id="text-area" value={userText} onChange={handleKeyPress} autoFocus />
        </div>
      </>
    )
}
