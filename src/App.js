import React, { useState } from 'react'
import UserTextDisplay from './components/UserText';

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
  const [timer, setTimer] = useState({
    startTime: null,
    endTime: null
  });

  if (timer.endTime) displayWPM(timer, (quote.split(" ")).length);
  
  const handleOnFinish = () => {
    const newTimer = {
      ...timer,
      endTime: performance.now(),
    };
    setTimer(newTimer);
  }

  return (
    <div className="text-container">
      <UserTextDisplay quote={quote} timer={timer} onFinish={(handleOnFinish)}/>
    </div>
  )
}



export default App