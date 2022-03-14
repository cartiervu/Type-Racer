import React from 'react'
import DisplayWordsRemaining from './DisplayWordsRemaining';

function getCompletedUserText(quoteObj) {
  return quoteObj.array.slice(0, quoteObj.currIndex).join("");
}

function getCorrectUserText(quote, userText) {
    for (let i = 0; i < quote.length; i++) {
      if (quote.charAt(i) !== userText.charAt(i)) {
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

function getRemainingQuoteWord(quote, userText) {
    for (let i = 0; i < quote.length; i++) {
      if (quote.charAt(i) !== userText.charAt(i)) {
        return quote.slice(i);
      }
    }
    return '';
}

function getRemainingQuote(quoteObj) {


  return quoteObj.array.slice(quoteObj.currIndex + 1).join("");
}

const DisplayText = ({ cName, text, containsCursor = false}) => {
  if (containsCursor) {
    return (
      <div className={`quotebox word ${cName}`}>
        <u>{text.charAt(0)}</u>{text.slice(1)}
      </div>
    )
  } else if (cName === "quote-mistake") {
    // SOURCE: https://stackoverflow.com/questions/59594129/how-can-i-insert-span-to-a-rendered-text-in-react
    // Colour the extra spaces
    const content = text.replaceAll(' ', '<span class="whitespace"> </span>')
    
    // then in rendering just use dangerouslySetInnerHTML
    return(
        <div className={`quotebox word ${cName}`} dangerouslySetInnerHTML={{
            __html: content
        }} />
    )
    
  }
  return (
    <div className={`quotebox word ${cName}`}>{text}</div>
  )
}

export default function DisplayQuote({ quoteObj, userText }) {

  return (
    <>
      <DisplayWordsRemaining wordsComplete={quoteObj.currIndex} totalWords={quoteObj.array.length}/>
      <div className="text-staging">
        {/*   // Because the following functions receive a parameter quote in the form quote = quoteObj.array[quoteObj.currIndex]
              //  After we finish one quoteObj (and prior to receiving another from the API), React re-renders this component with an ArrayOutOfBoundException
              //  This guard ensures that we are not performing functions on NULL */}
        { quoteObj.array[quoteObj.currIndex]
          ? (
            <>
            <DisplayText cName='quote-correct' text={getCompletedUserText(quoteObj)} />
            <DisplayText cName='quote-correct' text={getCorrectUserText(quoteObj.array[quoteObj.currIndex], userText)} />
            <DisplayText cName='quote-mistake' text={getIncorrectUserText(quoteObj.array[quoteObj.currIndex], userText)} />
            <DisplayText cName='quote-todo' text={getRemainingQuoteWord(quoteObj.array[quoteObj.currIndex], userText)} containsCursor={true}/>
            <DisplayText cName='quote-todo' text={getRemainingQuote(quoteObj)} />
            </>
          )
          : (null)
        }  
      </div>  
    </>
  )
}