import React, { useState } from 'react'
import DisplayQuote from './DisplayQuote';

export default function UserTextDisplay({ quote, timer, onFinish }) {
    const [userText, setUserText] = useState(
      {
        correctInputText: '',
        incorrectInputText: '',
      }
    );
    const [disabled, setDisabled] = useState(false);

    const handleUserTextChange = (event) => {
      if (!timer.startTime) timer.startTime = performance.now();

      const newUserText = { ...userText }
      if (event.key === 'Backspace') {
        if (userText.incorrectInputText.length > 0) newUserText.incorrectInputText = userText.incorrectInputText.slice(0, -1);
        else newUserText.correctInputText = userText.correctInputText.slice(0, -1);
      } else if (event.key === quote.charAt(userText.correctInputText.length)) {
        if (userText.incorrectInputText.length > 0) newUserText.incorrectInputText = userText.incorrectInputText.concat(event.key);
        else {
          newUserText.correctInputText = userText.correctInputText.concat(event.key);
          if (newUserText.correctInputText === quote) {
            setDisabled(true);
            onFinish();
          }
        }
      } else if (event.key.length === 1){
        newUserText.incorrectInputText = userText.incorrectInputText.concat(event.key); 
      }
      setUserText(newUserText);
    }

    return (
      <>
        <div className="text-staging">
          <DisplayQuote cName='quote-correct' quote={userText.correctInputText} />
          <DisplayQuote cName='quote-mistake' quote={userText.incorrectInputText} />
          <DisplayQuote cName='quote-todo' containsCursor={true} quote={quote.substring(userText.correctInputText.length,quote.length)} />
        </div>
        <div id="text-box">
          <input disabled={disabled} onKeyDown={(e) => handleUserTextChange(e)} style={{width: "500px"}} autoFocus />
        </div>
      </>
    )
}
