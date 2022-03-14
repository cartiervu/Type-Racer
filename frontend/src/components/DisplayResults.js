import React from 'react'
import { useState } from 'react';

// Return the WPM from the active user
function computeScore(quote, timer, mode) {
  if (mode.type === "words") {
    // Time it took to do X words
    return ((timer.endTime - timer.startTime) / 1000).toFixed(3);
  } else {
    // Calculate WPM
    const words = (quote.split(' ')).length;
    const timeElapsed = (timer.endTime - timer.startTime) / 60000;
  
    return (words / timeElapsed).toFixed(1);
  }

}

// Return the rank associated with the active user's WPM
function findRank(scores, newScore, mode) {
  let rank = 0;

  if (mode.type === "words") {
    // We want the QUICKEST time (i.e. smallest)
    // here, scores is sorted in ascending order
    for (const key in scores) {
      if (scores[key].seconds > newScore.seconds) {
        return rank;
      }
      rank++;
    }
  } else if (mode.type === "quote") {
    // We want the HIGHEST wpm
    //  here, scores is sorted in descending order
    for (const key in scores) {
      if (scores[key].wpm < newScore.wpm) {
        return rank;
      }
      rank++;
    }
  }



  return rank;
}

const ActiveScore = ({score, mode, api}) => {

  const [username, setUsername] = useState("");
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
    if (mode.type === "words") {
      const newScore = {
        "username": username,
        "seconds": score
      }

      if (mode.length === 15) {
        // Create new record
        api
        .createWords15Score(newScore)
          .then(result => {
            // Prune database
            api
            .pruneWords15Database()
            .then(setSubmitted(true))
            .catch(error => console.log("uh-oh"))
          })
          .catch(error => console.log("uh-oh"))
      } else if (mode.length === 30) {
        // Create new record
        api
        .createWords30Score(newScore)
          .then(result => {
            // Prune database
            api
            .pruneWords30Database()
            .then(setSubmitted(true))
            .catch(error => console.log("uh-oh"))
          })
          .catch(error => console.log("uh-oh"))
      }

    } else if (mode.type === "quote") {
      const newScore = {
        "username": username,
        "wpm": score
      }

      // Create new record
      api
      .createWPMScore(newScore)
        .then(result => {
          // Prune database
          api
          .pruneWPMDatabase()
          .then(setSubmitted(true))
          .catch(error => console.log("uh-oh"))
        })
        .catch(error => console.log("uh-oh"))
    }
    
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
              onChange = {onChange}
              maxLength="10" />
          </label>
        </form>
      </div>
      )
    }
    <div className='wpm player-active-score'>{score}</div>
    </>
  )
}

const RegularScore = ({username, score}) => {
  return (
    <>
      <div className='username'>{username}</div>
      <div className='wpm'>{score}</div>
    </>
  )
}

const DisplayLeaderboard = ({ scores, latestScore, mode, api }) => {
  
  let tempScoreArray = [...scores]
  let newScore = null;

  // Create a temporary object to insert into a copy of the array (for the map function)
  if (mode.type === "words") {
    newScore = {
      'seconds': latestScore,
      'id': -1
    }
  } else if (mode.type === "quote") {
    newScore = {
      'wpm': latestScore,
      'id': -1
    }
}


  // Add to array in the correct spot
  const rank = findRank(tempScoreArray, newScore, mode);
  tempScoreArray.splice(rank, 0, newScore)

  // If rank is greater than 10, do not allow the user the option to enter their score
    // Otherwise, do allow the user the option to enter their score
  return (
    <div className='leaderboard'>
      <div className='leaderboard-header'>
        <div className='username'>Name</div>
        {mode.type === "words"
          ? (<div className='wpm'>Score</div>)
          : (<div className='wpm'>WPM</div>)}
      </div>
      {tempScoreArray.map((score, index) => (
        <div key={score.id}>
          <div className='player-score-container'>
            {rank >= 10 && index === rank
              ? <></>
              : (index === rank
                  ? (mode.type === "words"
                      ? <ActiveScore score={score.seconds} mode={mode} api={api}/>
                      : <ActiveScore score={score.wpm} mode={mode} api={api}/>
                    )
                  : (mode.type === "words"
                      ? <RegularScore username={score.username} score={score.seconds}/>
                      : <RegularScore username={score.username} score={score.wpm}/>
                    )
              )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DisplayResults({ scores, quoteObj, timeSplits, timer, mode, api }) {
  const latestScore = computeScore(quoteObj.array.join(""), timer, mode);

  return (
    <div className='results'>
      <DisplayLeaderboard scores={scores} latestScore={latestScore} mode={mode} api={api}/>
      <hr/>
      <div className='wpm'>
        {mode.type === "words"
          ? (<># of Seconds: {latestScore}</>)
          : (<>Words Per Minute: {latestScore}</>)}
      </div>
    </div>
  )
}