import React from 'react'

export default function DisplayWordsRemaining({ wordsComplete, totalWords }) {
  return (
    <div className="words-remaining-container">
      {wordsComplete}/{totalWords}
    </div>
  )
}