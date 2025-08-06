import { Button } from 'reactstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LeaderModal from './LeaderModal';
import { useSpring, animated } from 'react-spring';


const GamePanel = () => {
    const [currentCountry, setCurrentCountry] = useState(null);
    const [buttonNames, setButtonNames] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [finalStreak, setFinalStreak] = useState(0);
    const [countryNameDisplay, setCountryNameDisplay] = useState('none');
    const [showModal, setShowModal] = useState(false);
    const [toggle, setToggle] = useState(false);

    const animatedStyle = useSpring({
        opacity: toggle ? 1 : 0,
        transform: toggle ? 'scale(1,1)' : 'scale(0.5,0.6)',
        config: { duration: 1100 }
    });

    useEffect(() => {
        setToggle(true);
    }, [])

    useEffect(() => {
        const getRandomCountry = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,population,area,region');
                const countries = response.data;

                const randomCountry = countries[Math.floor(Math.random() * countries.length)];

                const simplifiedCountry = {
                    name: randomCountry.name.common,
                    flag: randomCountry.flags?.png || '', // fallback to empty string
                    population: randomCountry.population,
                    area: randomCountry.area,
                    region: randomCountry.region,
                };

                setCurrentCountry(simplifiedCountry);

                const names = [simplifiedCountry.name];
                while (names.length < 4) {
                    const randomName = countries[Math.floor(Math.random() * countries.length)].name.common;
                    if (!names.includes(randomName)) {
                        names.push(randomName);
                    }
                }

                setButtonNames(names.sort(() => Math.random() - 0.5));
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        getRandomCountry();
    }, []);


    const handleButtonClick = (e, currentCountry) => {
        const nextCountryBtn = document.getElementById('nextCountryBtn')
        const buttons = document.querySelectorAll('.button');
        const countryDisplay = document.getElementById('countryDisplay');
        const countryNameDisplay = document.getElementById('countryNameDisplay');
        const pageSubtitle = document.getElementById('pageSubtitle');
        const infoItems = document.querySelectorAll('.infoItem');

        if (e.target.textContent == currentCountry.name) {
            countryDisplay.textContent = `👍 Yes! The correct country is`;
            countryDisplay.style.color = 'green';
            countryNameDisplay.style.color = 'green';
            setCountryNameDisplay('block');
            setCurrentStreak(currentStreak + 1);
            // document.body.style.backgroundColor = 'navy';
        } else {
            countryDisplay.textContent = `😢 That's incorrect!  The correct country is`;
            countryDisplay.style.color = 'red';
            setCountryNameDisplay('block');
            countryNameDisplay.style.color = 'red';
            setFinalStreak(currentStreak);
            setCurrentStreak(0);
            setShowModal(true);
            setCurrentCountry(null);
            // document.body.style.backgroundColor = 'darkorange'
        }

        const pageTitleSmall = document.getElementById('pageTitleSmall');
        pageTitleSmall.style.display = 'block';
        const pageTitle = document.getElementById('pageTitle');
        pageTitle.style.display = 'none';

        buttons.forEach((button) => {
            button.disabled = true;
        })
        infoItems.forEach(infoItem => infoItem.style.display = 'none')

        // setCountryNameDisplay('block');
        nextCountryBtn.style.display = 'block';
        pageSubtitle.style.display = 'none';
        buttons.forEach(button => button.style.display = 'none')
    }

    const handleNextCountry = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,population,area,region');
            const countries = response.data;

            const randomCountry = countries[Math.floor(Math.random() * countries.length)];

            const simplifiedCountry = {
                name: randomCountry.name.common,
                flag: randomCountry.flags?.png || '',
                population: randomCountry.population,
                area: randomCountry.area,
                region: randomCountry.region,
            };

            setCurrentCountry(simplifiedCountry);

            const names = [simplifiedCountry.name];
            while (names.length < 4) {
                const randomName = countries[Math.floor(Math.random() * countries.length)].name.common;
                if (!names.includes(randomName)) {
                    names.push(randomName);
                }
            }

            setButtonNames(names.sort(() => Math.random() - 0.5));

            // reset UI
            const buttons = document.querySelectorAll('.button');
            const infoItems = document.querySelectorAll('.infoItem');
            const nextCountryBtn = document.getElementById('nextCountryBtn');
            const countryDisplay = document.getElementById('countryDisplay');

            buttons.forEach(button => {
                button.disabled = false;
                button.style.display = 'block';
            });

            infoItems.forEach(item => item.style.display = 'block');

            if (countryDisplay) countryDisplay.textContent = 'Which country am I??';
            if (nextCountryBtn) nextCountryBtn.style.display = 'none';

            setCountryNameDisplay('none');
            setFinalStreak(0);
            document.body.style.backgroundColor = '#212122';
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };


    return (
        <div className='gamePanel'>
            {showModal && (<LeaderModal finalStreak={finalStreak} handleNextCountry={handleNextCountry} setShowModal={setShowModal} setCountryNameDisplay={setCountryNameDisplay} />)}

            {currentCountry ? (
                !showModal && (
                    <div>
                        <div id='currentStreakDiv'>
                            <p id='currentStreakDisplay'>
                                Current Streak: <span style={{ color: 'lime', fontSize: '1.8rem' }}>{currentStreak}</span>
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
                                <li id='flagItem'>
                                    <animated.div style={animatedStyle} >
                                        <img className='flag' id='flag' src={currentCountry.flag} />
                                    </animated.div>

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
                )) :
                <p>Loading country data</p>
            }
        </div>
    )
}

export default GamePanel;