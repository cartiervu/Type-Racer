import React, { useState, useEffect } from 'react'
import Text from './components/UserText';
import DisplayResults from './components/DisplayResults'

async function getRandomWikiPage() {
  const endpoint = `https://simple.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=random&grnnamespace=0&prop=revisions%7Cimages&rvprop=content&grnlimit=25`
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
      
      if (result.length > 25 && result.length < 250) {
          return result;
      }
      // return result;
  }
}

async function searchWikipedia(id) {
  const endpoint = `https://simple.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${id}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
      throw Error(response.statusText);
  }
  const json = await response.json();

  return json.query.pages[id].extract;
}

export default function App({ scores }) {
  const [quote, setQuote] = useState('');
  const [timer, setTimer] = useState({
    startTime: null,
    endTime: null
  });

  useEffect(() => {
    getRandomWikiPage()
      .then(response => setQuote(response))
  }, []);

  const handleOnFinish = () => {
    const newTimer = {
      ...timer,
      endTime: performance.now(),
    };
    setTimer(newTimer);
  }

  return (
    <div className="text-container">
      {!timer.endTime ? (
        <Text quote={quote} timer={timer} onFinish={(handleOnFinish)}/>
        ) : (
          <DisplayResults scores={scores} quote={quote} timer={timer}/>
        )}
    </div>
  )
}
