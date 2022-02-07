import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

const scores = [
  {
    "id": 1,
    "username": "Alphari",
    "wpm": 120
  },
  {
    "id": 2,
    "username": "Blaber",
    "wpm": 83
  },
  {
    "id": 3,
    "username": "Perkz",
    "wpm": 42
  }
]

ReactDOM.render(
  <App scores={scores} />,
  document.getElementById('root')
)