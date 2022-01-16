import React, { useState } from 'react'
import DisplayQuote from './components/DisplayQuote'

const displayWPM = (timer, wordCount) => {
  console.log(timer, wordCount)
  const timeElapsed = (timer.endTime - timer.startTime) / 60000;
  const wordsPerMinute = wordCount / timeElapsed;
  console.log("Words Per Minute: " + wordsPerMinute);
}

const App = () => {
  const [userText, setUserText] = useState('');
  const [mistakeText, setMistakeText] = useState('');
  const [timer, setTimer] = useState({startTime: null, endTime: null})
  const [disabled, setDisabled] = useState(false);

  const quote = "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.";
  
  if (timer.endTime) displayWPM(timer, (quote.split(" ")).length);
  const handleUserTextChange = (event) => {
    if (!timer.startTime) {
      const newTimer = {
        ...timer,
        startTime: performance.now(),
      };
      setTimer(newTimer);
    }

    if (event.key === 'Backspace') {
      if (mistakeText.length > 0) {
        setMistakeText(mistakeText.substring(0, mistakeText.length - 1));
      } else {
        setUserText(userText.substring(0, userText.length - 1));
      }
    } else if (event.key === quote.charAt(userText.length)) {
      if (mistakeText.length > 0) {
        setMistakeText(mistakeText.concat(event.key));
      } else {
        const copy = userText.concat(event.key);
        setUserText(copy);
        if (copy === quote) {
          setDisabled(true);
          const newTimer = {
            ...timer,
            endTime: performance.now(),
          };
          setTimer(newTimer);
        }
      }
    } else if (event.key.length === 1){
      setMistakeText(mistakeText.concat(event.key)); 
    }
  }
  
  return (
    <div class="text-container">
      <div class="text-staging">
      <DisplayQuote cName='quote-correct' quote={quote.substring(0,userText.length)} />
        <DisplayQuote cName='quote-mistake' quote={mistakeText} />
        <DisplayQuote cName='quote-todo' containsCursor={true} quote={quote.substring(userText.length,quote.length)} />
      </div>
      <p></p>
      <div id="text-box">
        <input disabled={disabled} onKeyDown={(e) => handleUserTextChange(e)} style={{width: "500px"}} autoFocus />
      </div>
    </div>
  )
}



export default App