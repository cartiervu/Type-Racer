import React, { useState } from 'react'
import DisplayQuote from './DisplayQuote';

export default function UserText({ quoteObj, timer, timeSplits, onFinish, isStarted }) {

    const [userText, setUserText] = useState('');

    if (!isStarted.start) {
      isStarted.start = true;
      setUserText('');
    }

    const handleKeyPress = (event) => {
      if (!timer.startTime) timer.startTime = performance.now();
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

    return (
      <>
        <DisplayQuote quoteObj={quoteObj} userText={userText}/>
        <div id="text-box">
          <textarea id="text-area" value={userText} onChange={handleKeyPress} autoFocus />
        </div>
      </>
    )
}
