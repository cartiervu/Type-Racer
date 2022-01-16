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

export default DisplayQuote