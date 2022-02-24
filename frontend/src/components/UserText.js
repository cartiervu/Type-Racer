import React, { useState } from 'react'
import DisplayQuote from './DisplayQuote';

export default function UserText({ quoteObj, timer, timeSplits, onFinish }) {
    const [userText, setUserText] = useState('');
    const [disabled, setDisabled] = useState(false);

    // const handleKeyPress = (event) => {
    //   if (!timer.startTime) timer.startTime = performance.now();
    //   setUserText(event.target.value);
    //   if (event.target.value === quote) {
    //     setDisabled(true);
    //     onFinish();
    //   }
    // }
    const handleKeyPress = (event) => {
      if (!timer.startTime) timer.starTime = performance.now();
      setUserText(event.target.value);
      if (event.target.value === (quoteObj.array[quoteObj.currIndex])) {
        timeSplits.push(performance.now());
        quoteObj.currIndex++;
        setUserText('');
        if (quoteObj.currIndex >= quoteObj.array.length) {
          setDisabled(true);
          onFinish();
        }
      }
    }

    return (
      <>
        <DisplayQuote quoteObj={quoteObj} userText={userText}/>
        <div id="text-box">
          <input value={userText} disabled={disabled} onChange={handleKeyPress} style={{width: "500px"}} autoFocus />
        </div>
      </>
    )
}
