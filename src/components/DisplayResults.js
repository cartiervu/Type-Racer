import React from 'react'

function computeWPM(quote, timer) {
  const words = (quote.split(' ')).length;
  const timeElapsed = (timer.endTime - timer.startTime) / 60000;

  return (words / timeElapsed).toFixed(1);
}

export default function DisplayResults({ quote, timer }) {
  return (
    <div className='results'>
      Words Per Minute: {computeWPM(quote, timer)}
    </div>
  )
}