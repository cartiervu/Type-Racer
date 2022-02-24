import React from 'react'

function addToDatabase() {
  console.log("adding to database...")
}

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
              onChange = {onChange}
              maxLength="10" />
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