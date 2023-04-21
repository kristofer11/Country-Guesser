import { Button } from 'reactstrap';

const GamePanel = () => {
  return (
    <div>
        <div className='countryDisplayDiv'>
            <h3 className='countryName'>Which country am I??</h3>            
        </div>

        <div className='countryInfoDiv'>
            <ul className='countryInfoList'>
                <li className='infoItem population'>
                    <p>
                        Population: 
                        <span id='population'> 1,300,000</span>
                    </p>
                </li>
                <li className='infoItem area'>
                    <p>
                        Area: 
                        <span id='area'> 5,000 square miles</span>
                    </p>
                </li>                
                <li className='infoItem'>
                    <p className='flag' id='flag'>
                        🇲🇽
                    </p>
                </li>                
            </ul>
        </div>

        <div className='buttonDiv'>
            <Button className='mx-2'>Japan</Button>
            <Button className='mx-2'>Mexico</Button>
            <Button className='mx-2'>South Africa</Button>
            <Button className='mx-2'>Turkey</Button>
        </div>
    </div>
  )
}

export default GamePanel