import { useState } from 'react'
import './App.css';
import GamePanel from './components/gamePanel'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <h1 className='pageTitle'>Country Guesser!</h1>
        <h2 className='pageSubtitle'>How many countries can you guess based on the info given?</h2>
        < GamePanel />
    </>
  )
}

export default App
