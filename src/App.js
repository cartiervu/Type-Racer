import React, { useState } from 'react'
import DisplayQuote from './components/DisplayQuote'

// TODO: Focus on input field
const App = () => {
  const [userText, setUserText] = useState('');
  const [mistakeText, setMistakeText] = useState('');
  const quote = "Even the world's most successful individuals have experienced their fair share of setbacks and hardships. There's much to learn from their challenges as well as their success. Luckily, they've condensed their wisdom into meaningful quotes that you can store for later use."

  const handleUserTextChange = (event) => {
    console.log(userText)
    if (event.key === 'Backspace') {
      if (mistakeText.length > 0) {
        setMistakeText(mistakeText.substring(0, mistakeText.length - 1));
      } else {
        setUserText(userText.substring(0, userText.length - 1));
      }
    } else if (event.key === quote.charAt(userText.length)) {
      if (mistakeText.length > 0) {
        let temp = mistakeText;
        setMistakeText(temp.concat(event.key));
      } else {
        let temp = userText;
        setUserText(temp.concat(event.key));
      }
    } else if (event.key.length === 1){
      // A mistake was made
      let temp = mistakeText;
      // Regex to filter alphanumeric only - .replace(/[\W_]+/g," "
      setMistakeText(temp.concat(event.key));
    }
  }
  
  return (
    <div class="text-container">
      <DisplayQuote cName='quote-correct' quote={quote.substring(0,userText.length)} />
      <DisplayQuote cName='quote-mistake' quote={mistakeText} />
      <DisplayQuote cName='quote-todo' quote={quote.substring(userText.length,quote.length)} />
      <p></p>
      <div id="text-box">
        <input onKeyDown={(e) => handleUserTextChange(e)} style={{width: "500px"}} autoFocus />
      </div>
    </div>
  )
}



export default App