import { Button } from 'reactstrap';
import { useState, useEffect, useCallback } from 'react';
import LeaderModal from './LeaderModal';
import { useSpring, animated } from 'react-spring';
import countryApiService from '../services/countryApi';

const GamePanel = () => {
    const [currentCountry, setCurrentCountry] = useState(null);
    const [buttonNames, setButtonNames] = useState([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [finalStreak, setFinalStreak] = useState(0);
    const [countryNameDisplay, setCountryNameDisplay] = useState('none');
    const [showModal, setShowModal] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countries, setCountries] = useState([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [infoItemsVisible, setInfoItemsVisible] = useState(true);

    const animatedStyle = useSpring({
        opacity: toggle ? 1 : 0,
        transform: toggle ? 'scale(1,1)' : 'scale(0.5,0.6)',
        config: { duration: 1100 }
    });

    useEffect(() => {
        setToggle(true);
    }, [])

    // Fetch countries data using the API service
    const fetchCountries = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const countriesData = await countryApiService.fetchCountries();
            setCountries(countriesData);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch countries:', error.message);
            setError('Failed to load country data. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const getRandomCountry = useCallback(() => {
        if (countries.length === 0) return;
        
        try {
            const randomCountry = countryApiService.getRandomCountry(countries);
            setCurrentCountry(randomCountry);
            
            const options = countryApiService.generateOptions(randomCountry, countries, 4);
            setButtonNames(options);
        } catch (error) {
            console.error('Error getting random country:', error.message);
            setError('Error loading country data. Please try again.');
        }
    }, [countries]);

    useEffect(() => {
        if (countries.length > 0) {
            getRandomCountry();
        }
    }, [countries, getRandomCountry]);

    const handleButtonClick = (e, currentCountry) => {
        if (e.target.textContent == currentCountry.name) {
            setCountryNameDisplay('block');
            setCurrentStreak(currentStreak + 1);
        } else {
            setCountryNameDisplay('block');
            setFinalStreak(currentStreak);
            setCurrentStreak(0);
            setShowModal(true);
            setCurrentCountry(null);
        }

        // Disable buttons and hide info items
        setButtonsDisabled(true);
        setButtonsVisible(false);
        setInfoItemsVisible(false);
    }

    const handleNextCountry = () => {
        // Reset all states
        setShowModal(false);
        setCountryNameDisplay('none');
        setFinalStreak(0);
        setButtonsDisabled(false);
        setButtonsVisible(true);
        setInfoItemsVisible(true);
        
        // Get a new random country
        getRandomCountry();
        
        // Reset background color
        document.body.style.backgroundColor = '#212122';
    }

    const formatPopulation = (population) => {
        if (!population) return 'N/A';
        return new Intl.NumberFormat().format(population);
    };

    const formatArea = (area) => {
        if (!area) return 'N/A';
        return new Intl.NumberFormat().format(area);
    };

    if (loading) {
        return (
            <div className='gamePanel'>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading country data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='gamePanel'>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <Button onClick={fetchCountries} color="primary">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='gamePanel'>
            {showModal && (<LeaderModal finalStreak={finalStreak} handleNextCountry={handleNextCountry} setShowModal={setShowModal} setCountryNameDisplay={setCountryNameDisplay}/>)}

            {!showModal && currentCountry && (
                <div>
                    <div id='currentStreakDiv'>
                        <p id='currentStreakDisplay'>
                            Current Streak: <span style={{ color: 'lime', fontSize: '1.8rem' }}>{currentStreak}</span>
                        </p>
                    </div>
                    <div className='nextCountryDiv'>
                        <Button
                            style={{ display: countryNameDisplay === 'block' && finalStreak === 0 ? 'block' : 'none' }}
                            id='nextCountryBtn'
                            onClick={handleNextCountry}
                        >
                            Next Country
                        </Button>
                    </div>

                    <div className='countryDisplayDiv'>
                        <h3 className='countryDisplay' id='countryDisplay'>
                            {countryNameDisplay === 'none' ? 'Which country am I??' : 
                             finalStreak > 0 ? '😢 That\'s incorrect! The correct country is' : 
                             '👍 Yes! The correct country is'}
                        </h3>
                        <h2 
                            style={{ 
                                display: countryNameDisplay, 
                                color: finalStreak > 0 ? 'red' : 'green' 
                            }} 
                            id='countryNameDisplay'
                        >
                            {currentCountry.name}
                        </h2>
                    </div>

                    <div className='countryInfoDiv'>
                        <ul className='countryInfoList'>
                            <li id='flagItem'>
                                <animated.div style={animatedStyle} >
                                    <img className='flag' id='flag' src={currentCountry.flag} alt={`Flag of ${currentCountry.name}`} />
                                </animated.div>
                            </li>

                            <li className='infoItem population' style={{ display: infoItemsVisible ? 'block' : 'none' }}>
                                <p>
                                    Population:
                                    <span id='population'> {formatPopulation(currentCountry.population)}</span>
                                </p>
                            </li>
                            <li className='infoItem area' style={{ display: infoItemsVisible ? 'block' : 'none' }}>
                            <p>
                                Area:
                                <span id='area'> {formatArea(currentCountry.area)} </span>
                                square kilometers
                            </p>
                        </li>
                            <li className='infoItem region' style={{ display: infoItemsVisible ? 'block' : 'none' }}>
                                <p>
                                    Region:
                                    <span id='region'> {currentCountry.region} </span>
                                </p>
                            </li>
                            {currentCountry.capital && currentCountry.capital !== 'N/A' && (
                                <li className='infoItem capital' style={{ display: infoItemsVisible ? 'block' : 'none' }}>
                                    <p>
                                        Capital:
                                        <span id='capital'> {currentCountry.capital} </span>
                                    </p>
                                </li>
                            )}

                        </ul>
                    </div>

                    <div className='buttonDiv' style={{ display: buttonsVisible ? 'block' : 'none' }}>
                        <Button
                            className='m-2 button'
                            disabled={buttonsDisabled}
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[0]}
                        </Button>
                        <Button
                            className='m-2 button'
                            disabled={buttonsDisabled}
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[1]}
                        </Button>
                        <Button
                            className='m-2 button'
                            disabled={buttonsDisabled}
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[2]}
                        </Button>
                        <Button
                            className='m-2 button'
                            disabled={buttonsDisabled}
                            onClick={(e) =>
                                handleButtonClick(e, currentCountry)}
                        >
                            {buttonNames[3]}
                        </Button>
                    </div>
                </div >
            )}

            {!showModal && !currentCountry && !loading && (
                <p>Loading country data</p>
            )}
        </div>
    )
}

export default GamePanel;