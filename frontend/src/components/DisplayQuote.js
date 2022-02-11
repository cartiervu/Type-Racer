import React from 'react'
import DisplayWordsRemaining from './DisplayWordsRemaining';

function getCorrectUserText(quote, userText) {
  for (let i = 0; i < quote.length; i++) {
    if (quote.charAt(i) !== userText.charAt(i)) {
      // return userText.slice(0, i);
      // console.log(userText.slice(0, i).split(' '));
      return userText.slice(0, i);
    }
  }
  return userText;
}

function getIncorrectUserText(quote, userText) {
  for (let i = 0; i < quote.length; i++) {
    if (quote.charAt(i) !== userText.charAt(i)) {
      return userText.slice(i);
    }
  }
  return '';
}

function getRemainingQuote(quote, userText) {
  for (let i = 0; i < quote.length; i++) {
    if (quote.charAt(i) !== userText.charAt(i)) {
      return quote.slice(i);
    }
  }
  return '';
}

const DisplayText = ({ cName, text, containsCursor = false}) => {
  if (containsCursor) {
    return (
      <div className={`quotebox word ${cName}`}>
        <u>{text.charAt(0)}</u>{text.slice(1)}
      </div>
    )
  }
  return (
    <div className={`quotebox word ${cName}`}>{text}</div>
  )
}

export default function DisplayQuote({ quote, userText }) {
  return (
    <>
      <DisplayWordsRemaining wordsComplete={getCorrectUserText(quote, userText).split(' ').length - 1} totalWords={quote.split(' ').length}/>
      <div className="text-staging">    
        <DisplayText cName='quote-correct' text={getCorrectUserText(quote, userText)}/>
        <DisplayText cName='quote-mistake' text={getIncorrectUserText(quote, userText)}/>
        <DisplayText cName='quote-todo' text={getRemainingQuote(quote, userText)} containsCursor={true}/>
      </div>
    </>
  )
}