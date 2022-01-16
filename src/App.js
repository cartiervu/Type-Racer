import React from 'react'
import DisplayQuote from './components/DisplayQuote'

const App = () => {
  const quote = "Even the world's most successful individuals have experienced their fair share of setbacks and hardships. There's much to learn from their challenges as well as their success. Luckily, they've condensed their wisdom into meaningful quotes that you can store for later use."
  return (
    <DisplayQuote quote={quote} />
  )
}

export default App