import React, { useState } from 'react'
import DisplayQuote from './DisplayQuote';

export default function UserText({ quote, timer, onFinish }) {
    const [userText, setUserText] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleKeyPress = (event) => {
      if (!timer.startTime) timer.startTime = performance.now();
      setUserText(event.target.value);
      if (event.target.value === quote) {
        setDisabled(true);
        onFinish();
      }
    }

    
    return (
      <>
        <DisplayQuote quote={quote} userText={userText}/>
        <div id="text-box">
          <input disabled={disabled} onChange={handleKeyPress} style={{width: "500px"}} autoFocus />
        </div>
      </>
    )
}
