import { useState } from 'react'
import './App.css';
import GamePanel from './components/gamePanel'; 
import Footer from './components/Footer';

function App() {

  return (
    <div className='app'>
        <h1 className='pageTitle'>Country Guesser!</h1>
        <h2 className='pageSubtitle' id='pageSubtitle'>Guess the country based on the info provided. How long can you keep your streak alive?</h2>

        <GamePanel />
        <Footer />
    </div>
  )
}

export default App;
