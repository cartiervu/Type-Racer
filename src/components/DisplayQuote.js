import React from 'react'

const DisplayWord = ({ word }) => {
  return (
    <div className="word">
      {word.split("").map(letter => <letter>{letter}</letter>)}
    </div>
  )
}

const DisplayQuote = ({ quote }) => {
  const wordArray = (quote.split(" ")).map(word => word + " ");
  return (
    <div className="quotebox">
      {wordArray.map(word => <DisplayWord word={word}/>)}
    </div>
  )
}

export default DisplayQuote