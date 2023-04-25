import { Button } from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

const GamePanel = () => {
    const [currentCountry, setCurrentCountry] = useState(null);
    const [buttonNames, setButtonNames] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [countryNameDisplay, setCountryNameDisplay] = useState('none');

    useEffect(() => {
        const getRandomCountry = async () => {

            const response = await axios.get('https://restcountries.com/v2/all');
            const countries = response.data;
            const randomIndex = Math.floor(Math.random() * countries.length);
            const randomCountry = countries[randomIndex];
            setCurrentCountry(randomCountry);

            const names = [randomCountry.name]
            while (names.length < 4) {
                const randomName = countries[Math.floor(Math.random() * countries.length)].name;
                if (!names.includes(randomName)) {
                    names.push(randomName);
                }
            }

            const shuffledNames = names.sort(() => Math.random() - 0.5);
            setButtonNames(shuffledNames);
            console.log(buttonNames)
        };

        getRandomCountry();

    }, []);

    const handleButtonClick = (e, currentCountry) => {
        const nextCountryBtn = document.getElementById('nextCountryBtn')
        const buttons = document.querySelectorAll('.button');
        const countryDisplay = document.getElementById('countryDisplay');
        const pageSubtitle = document.getElementById('pageSubtitle');

        if (e.target.textContent == currentCountry.name) {
            countryDisplay.textContent = `Yes, the correct country is`;
            setCurrentStreak(currentStreak + 1);
        } else {
            countryDisplay.textContent = `Sorry that's incorrect! The correct country is`
            setCurrentStreak(0)
        }
        buttons.forEach((button) => {
            button.disabled = true;
        })

        setCountryNameDisplay('block');
        nextCountryBtn.style.display = 'block';
        pageSubtitle.style.display = 'none';
    }

    const handleNextCountry = async (e, currentCountry) => {
        const response = await axios.get('https://restcountries.com/v2/all');
        const countries = response.data;
        const randomIndex = Math.floor(Math.random() * countries.length);
        const randomCountry = countries[randomIndex];
        setCurrentCountry(randomCountry);

        const names = [randomCountry.name];
        while (names.length < 4) {
            const randomName = countries[Math.floor(Math.random() * countries.length)].name;
            if (!names.includes(randomName)) {
                names.push(randomName);
            }
        }

        const buttons = document.querySelectorAll('.button');
        const shuffledNames = names.sort(() => Math.random() - 0.5);
        setButtonNames(shuffledNames)
        buttons.forEach((button) => {
            button.disabled = false;
        })

        countryDisplay.textContent = 'Which country am I??';
        nextCountryBtn.style.display = 'none';
        setCountryNameDisplay('none');

    }

    return (
        <div className='gamePanel'>
            {currentCountry ? (
                <div>
                    <div id='currentStreakDiv'>
                        <p id='currentStreakDisplay'>
                            Current Streak: {currentStreak}
                        </p>
                    </div>
                    <div className='nextCountryDiv'>
                        <Button
                            style={{ display: 'none' }}
                            id='nextCountryBtn'
                            onClick={handleNextCountry}
                        >
                            Next Country
                        </Button>
                    </div>

                    <div className='countryDisplayDiv'>
                        <h3 className='countryDisplay' id='countryDisplay'>Which country am I??</h3>
                        <h2 style={{ display: countryNameDisplay }} id='countryNameDisplay'>{currentCountry.name}</h2>
                    </div>

                    <div className='countryInfoDiv'>
                        <ul className='countryInfoList'>
                            <li className='infoItem'>
                                <img className='flag' id='flag' src={currentCountry.flag} />
                            </li>
                            <li className='infoItem population'>
                                <p>
                                    Population:
                                    <span id='population'> {currentCountry.population}</span>
                                </p>
                            </li>
                            <li className='infoItem area'>
                                <p>
                                    Area:
                                    <span id='area'> {currentCountry.area} </span>
                                    square miles
                                </p>
                            </li>
                            <li className='infoItem region'>
                                <p>
                                    Region:
                                    <span id='region'> {currentCountry.region} </span>
                                </p>
                            </li>

                        </ul>
                    </div>

                    <div className='buttonDiv'>
                        <Button
                            className='m-2 button'
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[0]}
                        </Button>
                        <Button
                            className='m-2 button'
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[1]}
                        </Button>
                        <Button
                            className='m-2 button'
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[2]}
                        </Button>
                        <Button
                            className='m-2 button'
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[3]}
                        </Button>
                    </div>

                </div >
            ) :
                <p>Loading country data</p>
            }
        </div>

    )
}

export default GamePanel;