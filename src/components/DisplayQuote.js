import React from 'react'

const DisplayWord = ({ word, containsCursor }) => {
  let charArray = word.split("");

  if (containsCursor) {
    return (
      <div className="word">
        <u>{charArray[0]}</u>
        {charArray.slice(1).map((word, i) => <DisplayWord key = {i} word={word}/>)}
      </div>
    )
  }

  return (
    <div className="word">
      {word.split("").map((letter, i) => <letter key ={i}>{letter}</letter>)}
    </div>
  )
}

const DisplayQuote = ({ quote, cName, containsCursor = false}) => {
  let wordArray = (quote.split(" ")).map(word => word + " ");
  wordArray[wordArray.length-1] = wordArray.at(-1).slice(0,-1);
  if (containsCursor) {
    return (
      <div className={`quotebox ${cName}`}>
        <DisplayWord word={wordArray[0]} containsCursor={containsCursor}/>
        {wordArray.slice(1).map((word, i) => <DisplayWord key = {i} word={word}/>)}
      </div>
    )
  }
  
  return (
    <div className={`quotebox ${cName}`}>
      {wordArray.map((word, i) => <DisplayWord key = {i} word={word}/>)}
    </div>
  )
}


export default DisplayQuote