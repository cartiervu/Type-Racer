import React from 'react'

function addToDatabase() {
  console.log("adding to database...")
}

function computeWPM(quote, timer) {
  const words = (quote.split(' ')).length;
  const timeElapsed = (timer.endTime - timer.startTime) / 60000;

  return (words / timeElapsed).toFixed(1);
}

const DisplayLeaderboard = ({ scores }) => {
  return (
    <div className='leaderboard'>
      <div className='leaderboard-header'>
        <div className='username'>Name</div>
        <div className='wpm'>WPM</div>
      </div>
      {scores.map(score => (
        <div key={score.id}>
          <div className='player-score-container'>
            <div className='username'>{score.username}</div>
            <div className='wpm'>{score.wpm}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DisplayResults({ scores, quote, timer }) {
  return (
    <div className='results'>
      <DisplayLeaderboard scores={scores} />
      <hr/>
      <div className='wpm'>
        Words Per Minute: {computeWPM(quote, timer)}
      </div>
    </div>
  )
}