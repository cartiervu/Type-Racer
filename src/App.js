import React, { useState } from 'react'
import DisplayQuote from './components/DisplayQuote'

async function getRandomWikiPage() {
  const endpoint = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=random&grnnamespace=0&prop=revisions%7Cimages&rvprop=content&grnlimit=25`
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw Error(response.statusText);
  }
  
  const json = await response.json();
  const pages = json.query.pages;

  for (const pageid in pages) {
      let result = await searchWikipedia(pageid);
      result = result.replace(/[^\x00-\x7F]/g, "");
      result = result.replace("  ", " ")
      
      if (result.length > 25 && result.length < 100) {
          return result;
      }
  }
}


async function searchWikipedia(id) {
  const endpoint = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${id}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
      throw Error(response.statusText);
  }
  const json = await response.json();

  return json.query.pages[id].extract;
}



const displayWPM = (timer, wordCount) => {
  console.log(timer, wordCount)
  const timeElapsed = (timer.endTime - timer.startTime) / 60000;
  const wordsPerMinute = wordCount / timeElapsed;
  console.log("Words Per Minute: " + wordsPerMinute);
}

const App = () => {
  const [quote, setQuote] = useState('');


  (async () => {
    const result = await getRandomWikiPage();
    if (quote === '') {
      setQuote(result)
    }
  })()  

  return (
  <Main quote={quote}/>
  )
  
}

const Main = ({quote}) => {
  const [userText, setUserText] = useState('');
  const [mistakeText, setMistakeText] = useState('');
  const [timer, setTimer] = useState({startTime: null, endTime: null})
  const [disabled, setDisabled] = useState(false);

  if (timer.endTime) displayWPM(timer, (quote.split(" ")).length);
  const handleUserTextChange = (event) => {
    if (!timer.startTime) {
      const newTimer = {
        ...timer,
        startTime: performance.now(),
      };
      setTimer(newTimer);
    }

    if (event.key === 'Backspace') {
      if (mistakeText.length > 0) {
        setMistakeText(mistakeText.substring(0, mistakeText.length - 1));
      } else {
        setUserText(userText.substring(0, userText.length - 1));
      }
    } else if (event.key === quote.charAt(userText.length)) {
      if (mistakeText.length > 0) {
        setMistakeText(mistakeText.concat(event.key));
      } else {
        const copy = userText.concat(event.key);
        setUserText(copy);
        if (copy === quote) {
          setDisabled(true);
          const newTimer = {
            ...timer,
            endTime: performance.now(),
          };
          setTimer(newTimer);
        }
      }
    } else if (event.key.length === 1){
      setMistakeText(mistakeText.concat(event.key)); 
    }
  }
  
  return (
    <div className="text-container">
      <div className="text-staging">
        <DisplayQuote cName='quote-correct' quote={quote.substring(0,userText.length)} />
        <DisplayQuote cName='quote-mistake' quote={mistakeText} />
        <DisplayQuote cName='quote-todo' containsCursor={true} quote={quote.substring(userText.length,quote.length)} />
      </div>
      <p></p>
      <div id="text-box">
        <input disabled={disabled} onKeyDown={(e) => handleUserTextChange(e)} style={{width: "500px"}} autoFocus />
      </div>
    </div>
  )
}



export default App