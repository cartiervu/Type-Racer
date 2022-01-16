import React from 'react'

const DisplayWord = ({ word }) => {
  return (
    <div className="word">
      {word.split("").map((letter, i) => <letter key ={i}>{letter}</letter>)}
    </div>
  )
}

const DisplayQuote = ({ quote, cName}) => {
  let wordArray = (quote.split(" ")).map(word => word + " ");
  wordArray[wordArray.length-1] = wordArray.at(-1).slice(0,-1);
  
  return (
    <div className={`quotebox ${cName}`}>
      {wordArray.map((word, i) => <DisplayWord key = {i} word={word}/>)}
    </div>
  )
}


export default DisplayQuote