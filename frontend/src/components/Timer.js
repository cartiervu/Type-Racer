import React, { useState, useEffect } from "react";

export default function Timer({ initMinutes = 0, initSeconds = 0, isStarted = false, onFinish }) {
  const [minutes, setMinutes] = useState(initMinutes);
  const [seconds, setSeconds] = useState(initSeconds);

  useEffect(() => {
    let interval = setInterval(() => {
      if (isStarted) {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            onFinish();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }
    }, 1000)

    return () => {
      clearInterval(interval);
    };
  })

  return (
    <div className="counter">
    { minutes === 0 && seconds === 0
        ? null
        : <>{minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</>
    }
    </div>
  )
}

export const MemoizedTimer = React.memo(Timer);