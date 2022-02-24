import React from 'react'

export default function DisplayWordsRemaining({ wordsComplete, totalWords }) {
  return (
    <div className="counter">
      {wordsComplete}/{totalWords}
    </div>
  )
}