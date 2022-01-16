import React, { useState } from 'react'
import DisplayQuote from './components/DisplayQuote'

const App = () => {
  const [userText, setUserText] = useState('');
  const quote = "Even the world's most successful individuals have experienced their fair share of setbacks and hardships. There's much to learn from their challenges as well as their success. Luckily, they've condensed their wisdom into meaningful quotes that you can store for later use."

  const handleUserTextChange = (event) => {
    event.preventDefault();
    if (event.key === 'Backspace') {
      setUserText(userText.substring(0, userText.length - 1));
    } else if (event.key === quote.charAt(userText.length)) {
      let temp = userText;
      setUserText(temp.concat(event.key));
    }
  }
  
  return (
    <div>
      <DisplayQuote quote={quote} />
      <form>
        <input 
          value={userText}
          onKeyDown={(e) => handleUserTextChange(e)}
        />
      </form>
    </div>
  )
}



export default App