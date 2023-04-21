import { Button } from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from 'axios'

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


    return (
        <>
        { currentCountry ? (
        <div>
            <div className='countryDisplayDiv'>
                <h3 className='countryDisplay' id='countryDisplay'>Which country am I?? { currentCountry.name }</h3>
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
                <Button className='mx-2'>{buttonNames[0]}</Button>
                <Button className='mx-2'>{buttonNames[1]}</Button>
                <Button className='mx-2'>{buttonNames[2]}</Button>
                <Button className='mx-2'>{buttonNames[3]}</Button>
            </div>
        </div >            
        ) : 
            <p>Loading country data</p>
    }        
        </>
        
    )
}

export default GamePanel;