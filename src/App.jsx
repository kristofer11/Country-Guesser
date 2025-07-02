import './App.css';
import GamePanel from './components/CountryGamePanel';
import Footer from './components/Footer';
import Title from './components/Title';



function App() {

    return (
        <div className='app'>
            <Title />
            <GamePanel />
            <Footer />
        </div>
    )
}

export default App;
