import React from 'react'
import { useState } from 'react';
import {Line} from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


// Return the actual elapsed time
function computeTime(quote, timer) {
  return ((timer.endTime - timer.startTime) / 1000).toFixed(3);
}

// Return the WPM from the active user
function computeScore(quoteObj, timer, mode) {
  var words;
  var timeElapsed;

  if (mode.type === "time") {
    // Time it took to do X words
    words = quoteObj.currIndex;
    timeElapsed = mode.length / 60;
  } else {
    // Calculate WPM
    words = (quoteObj.array.join("").split(' ')).length;
    timeElapsed = (timer.endTime - timer.startTime) / 60000;
  }

  return (words / timeElapsed).toFixed(1);
}

// Return the rank associated with the active user's WPM
function findRank(scores, newScore, mode) {
  let rank = 0;

  // if (mode.type === "words") {
  //   // We want the QUICKEST time (i.e. smallest)
  //   // here, scores is sorted in ascending order
  //   for (const key in scores) {
  //     if (scores[key].seconds > newScore.seconds) {
  //       return rank;
  //     }
  //     rank++;
  //   }
  // } else if (mode.type === "quote") {
    // We want the HIGHEST wpm
    //  here, scores is sorted in descending order
    for (const key in scores) {
      if (scores[key].wpm < newScore.wpm) {
        return rank;
      }
      rank++;
    }
  // }



  return rank;
}

const ActiveScore = ({score, elapsedTime, mode, api}) => {

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

    const newScore = {
      "username": username,
      "wpm": score
    }

    // Create object to be POSTED
    if (mode.type === "words") {
      // const newScore = {
      //   "username": username,
      //   "seconds": score
      // }

      if (mode.length === 3) {
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
      // const newScore = {
      //   "username": username,
      //   "wpm": score
      // }

      // Create new record
      api
      .createQuoteScore(newScore)
        .then(result => {
          // Prune database
          api
          .pruneQuoteDatabase()
          .then(setSubmitted(true))
          .catch(error => console.log("uh-oh"))
        })
        .catch(error => console.log("uh-oh"))
    } else if (mode.type === "time") {
      // Create new record
      api
      .createTimeScore(newScore)
        .then(result => {
          // Prune database
          api
          .pruneTimeDatabase()
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

const DisplayLeaderboard = ({ scores, latestScore, elapsedTime, mode, api }) => {
  
  let tempScoreArray = [...scores]
  let newScore = null;

  // Create a temporary object to insert into a copy of the array (for the map function)
  // if (mode.type === "words") {
  //   newScore = {
  //     'seconds': latestScore,
  //     'id': -1
  //   }
  // } else if (mode.type === "quote") {
    newScore = {
      'wpm': latestScore,
      'id': -1
    }
  // }


  // Add to array in the correct spot
  const rank = findRank(tempScoreArray, newScore, mode);
  tempScoreArray.splice(rank, 0, newScore)

  // If rank is greater than 10, do not allow the user the option to enter their score
    // Otherwise, do allow the user the option to enter their score
  return (
    <div className='leaderboard'>
      <div className='leaderboard-header'>
        <div className='username'>Name</div>
        <div className='wpm'>WPM</div>
        {/* <div> SECONDS </div> */}
        {/* {mode.type === "words"
          ? (<div className='wpm'>Score</div>)
          : (<div className='wpm'>WPM</div>)} */}
      </div>
      {tempScoreArray.map((score, index) => (
        <div key={score.id}>
          <div className='player-score-container'>
          {rank >= 10 && index === rank
              ? <></>
              : (index === rank
                  ? <ActiveScore score={score.wpm} elapsedTime={elapsedTime} mode={mode} api={api}/>
                  : <RegularScore username={score.username} score={score.wpm}/>
                )
          }
            {/* {rank >= 10 && index === rank
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
              )} */}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DisplayResults({ scores, quoteObj, timeSplits, timer, mode, api, chartWordsCompleted}) {
  const latestScore = computeScore(quoteObj, timer, mode);
  const elapsedTime = computeTime(quoteObj.array.join(""), timer);
  
  let wpmForChart = chartWordsCompleted.map((wordsCompleted, index) => {
    const seconds = index * 1;
    let wpm = 0;

    if (seconds > 0) {
      wpm = wordsCompleted * (60 / seconds);
    }
    
    return wpm;
  })


  let timeForChart = chartWordsCompleted.map((wordsCompleted, index) => {
    const seconds = index * 1;
    
    return seconds;
  })



  let x = timeForChart.filter((element, index) => {
    return index % 2 === 0;
  })

  let y = wpmForChart.filter((element, index) => {
    return index % 2 === 0;
  })

  x.push(parseFloat(elapsedTime))
  y.push(quoteObj.currIndex * (60 / parseFloat(elapsedTime)))




  const data = {
    labels: x,
    datasets: [
      {
        label: 'wpm',
        lineTension: 0.5,

        pointBackgroundColor: 'rgb(255,0,0)',
        pointRadius: 2.5,

        backgroundColor: 'rgba(255,0,0,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2.5,

        data: y
      }
    ]
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className='score-screen'>
      <div className='results'>
        <DisplayLeaderboard scores={scores} latestScore={latestScore} elapsedTime={elapsedTime} mode={mode} api={api}/>
        <hr/>
        <div className='wpm'>
          Words Per Minute:  {latestScore}
          {/* {mode.type === "words"
            ? (<># of Seconds:  {latestScore}</>)
            : (<>Words Per Minute:  {latestScore}</>)} */}
        </div>
      </div>

      <div className='chart'>
      <Line data={data} options={options} />
      </div>
    </div>
  )
}