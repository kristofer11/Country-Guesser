import { useState } from 'react'
import './App.css';
import GamePanel from './components/CountryGamePanel'; 
import Footer from './components/Footer';
import Title from './components/Title';
import Leaders from './components/Leaders';

function App() {

  return (
    <div className='app'>
        <Title />
        <GamePanel />
        <Footer />
        <Leaders />
    </div>
  )
}

export default App;
