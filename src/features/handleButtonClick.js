const countryDisplay = document.getElementById('countryDisplay');

export const handleButtonClick = (e, currentCountry) => {
    if (e.target.textContent == currentCountry) {
        countryDisplay.textContent = 'That is correct!'
        console.log('correct!')
    } else {
        console.log('incorrect!')
    }
}   