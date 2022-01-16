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

  const quote = "Even the world's most successful individuals have experienced their fair share of setbacks and hardships. There's much to learn from their challenges as well as their success. Luckily, they've condensed their wisdom into meaningful quotes that you can store for later use."

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
        <input onKeyDown={(e) => handleUserTextChange(e)} style={{width: "500px"}} autoFocus />
      </div>
    </div>
  )
}



export default App