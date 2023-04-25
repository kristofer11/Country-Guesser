import { Button } from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

const GamePanel = () => {
    const [currentCountry, setCurrentCountry] = useState(null);
    const [buttonNames, setButtonNames] = useState([]);

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
        console.log(currentCountry);

    }, []);

    const handleButtonClick = (e, currentCountry) => {
        const nextCountryBtn = document.getElementById('nextCountryBtn')
        const buttons = document.querySelectorAll('.button')

        if (e.target.textContent == currentCountry.name) {
            countryDisplay.textContent = `Yes, the correct country is ${currentCountry.name}!`
            console.log('correct!')
        } else {
            countryDisplay.textContent = `Sorry that's incorrect! The correct country is ${currentCountry.name}`
            console.log('incorrect!')
        }
        buttons.forEach((button) => {
            button.disabled = true;
        })

        nextCountryBtn.style.display = 'block';
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

        countryDisplay.textContent = 'Which country am I??'

    }

    return (
        <>
        { currentCountry ? (
        <div>
            <Button 
                style={{display: 'none'}} 
                id='nextCountryBtn'
                onClick={handleNextCountry}
            >
                    Next Country
                </Button>
            <div className='countryDisplayDiv'>
                <h3 className='countryDisplay' id='countryDisplay'>Which country am I??</h3>
            </div>

            <div className='countryInfoDiv'>
                <ul className='countryInfoList'>
                    <li className='infoItem population'>
                        <p>
                            Population:
                            <span id='population'> { currentCountry.population }</span>
                        </p>
                    </li>
                    <li className='infoItem area'>
                        <p>
                            Area:
                            <span id='area'> { currentCountry.area} </span>
                            square miles
                        </p>
                    </li>
                    <li className='infoItem region'>
                        <p>
                            Region:
                            <span id='region'> { currentCountry.region} </span>
                        </p>
                    </li>
                    <li className='infoItem'>
                        <img className='flag' id='flag' src={currentCountry.flag} style={{width: '200px'}} />
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
        </>
        
    )
}

export default GamePanel;