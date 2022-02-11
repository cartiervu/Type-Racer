import React from 'react'
import { useState } from 'react';

// Return the WPM from the active user
function computeWPM(quote, timer) {
  const words = (quote.split(' ')).length;
  const timeElapsed = (timer.endTime - timer.startTime) / 60000;

  return (words / timeElapsed).toFixed(1);
}

// Return the rank associated with the active user's WPM
function findRank(scores, newScore) {

  let rank = 0;

  for (const key in scores) {
    if (scores[key].wpm < newScore.wpm) {
      return rank;
    }
    rank++;
  }

  return rank;
}

const ActiveScore = ({wpm, api}) => {

  const [username, setUsername] = useState("(your name here)");
  const [submitted, setSubmitted] = useState(false)

  // As user types update the input box
  const onChange = (event) => {
    setUsername(event.target.value)
  }

  // When the "enter" button is pressed
  const onSubmit = (event) => {

    if (submitted) {
      return;
    }

    event.preventDefault();

    // Create object to be POSTED
    const newScore = {
      "username": username,
      "wpm": wpm
    }


    // Create new record
    api.create(newScore)
      .then(result => {
        // Prune database
        api.pruneDatabase()
        .then(setSubmitted(true))
        .catch(error => console.log("uh-oh"))
      })
      .catch(error => console.log("uh-oh"))

  }

  return (
    <>
    {submitted
    ? <div className='username player-active-score'>{username}</div>
    : (
      <div className='username player-active-score'>
        <form onSubmit={onSubmit}>
          <label>
            <input autoFocus
              value={username}
              onChange = {onChange} />
          </label>
        </form>
      </div>
      )
    }
    <div className='wpm player-active-score'>{wpm}</div>
    </>
  )
}

const RegularScore = ({username, wpm}) => {
  return (
    <>
      <div className='username'>{username}</div>
      <div className='wpm'>{wpm}</div>
    </>
  )
}

const DisplayLeaderboard = ({ scores, wpm, api }) => {

  let temp = [...scores]

  // Create a temporary object to insert into a copy of the array (for the map function)
  let newScore = {
    'wpm': wpm,
    'id': 123
  }

  // Add to array in the correct spot
  const rank = findRank(temp, newScore);
  temp.splice(rank, 0, newScore)

  console.log(rank)

  // If rank is greater than 10, do not allow the user the option to enter their score
    // Otherwise, do allow the user the option to enter their score
  return (
    <div className='leaderboard'>
      <div className='leaderboard-header'>
        <div className='username'>Name</div>
        <div className='wpm'>WPM</div>
      </div>
      {temp.map((score, index) => (
        <div key={score.id}>
          <div className='player-score-container'>
            {rank >= 10 && index === rank
              ? <></>
              : (index === rank
                  ? <ActiveScore wpm={score.wpm} api={api}/>
                  : <RegularScore username={score.username} wpm={score.wpm}/>
              )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DisplayResults({ scores, quote, timer, api }) {

  const wpm = computeWPM(quote, timer);

  return (
    <div className='results'>
      <DisplayLeaderboard scores={scores} wpm={wpm} api={api}/>
      <hr/>
      <div className='wpm'>
        Words Per Minute: {wpm}
      </div>
    </div>
  )
}