import React from 'react'

const DisplayWord = ({ word }) => {
  return (
    <div class="word">
      {word.split("").map(letter => <letter>{letter}</letter>)}
    </div>
  )
}

const DisplayQuote = ({ quote }) => {
  const wordArray = (quote.split(" ")).map(word => word + "_");
  return (
    <div class="quotebox">
      {wordArray.map(word => <DisplayWord word={word}/>)}
    </div>
  )
}

const App = () => {
  const quote = "Even the world's most successful individuals have experienced their fair share of setbacks and hardships. There's much to learn from their challenges as well as their success. Luckily, they've condensed their wisdom into meaningful quotes that you can store for later use."
  return (
    <DisplayQuote quote={quote} />
  )
}

export default App