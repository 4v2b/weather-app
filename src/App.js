import './App.css';
import Loading from './Loading';
import { useState } from 'react';

export default function App() {
  return (
    <div className="app">
      <Box />
    </div>
  );
}

function Box() {
  const [input, setInput] = useState('');
  const [forecast, setForecast] = useState(null);
  const [hints, setHints] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);

  async function handleInput(value) {
    setInput(value);

    fetchSuggestions(value).then((hints) => {
      setHints(hints);
    });
  }

  async function handleClick(placeId) {
    setHints(null);
    setInput("");
    setIsLoading(true);

    fetchForecast(placeId).then((forecast) => {
      if (!forecast?.error) {
        setForecast(forecast);
        setIsLoading(false);
      }
    });
  }

  function handlePreviewClick(index){
    setCurrentWeather(forecast.forecast.forecastday[index]);
  }

  let infoBar = <></>;
  let previews = <></>;

  if (forecast && !forecast?.error) {

    const infoBarIcon = getWeatherImagePath(forecast.current.condition.icon);

    previews = forecast.forecast.forecastday?.map((element, index ) => {
      const previewIcon = getWeatherImagePath(element.day.condition.icon);
      return <Preview key={index} index={index} onPreviewClick={handlePreviewClick} dateString={element.date} imgPath={previewIcon} maxTemperature={element.day.maxtemp_c} minTemperature={element.day.mintemp_c} />
    });

    infoBar = <InfoBar temperature={forecast.current.temp_c} icon={infoBarIcon} />
  }

  return (<>
    <SearchBar input={input} hints={hints} onInputChange={handleInput} onHintClick={handleClick} />

    <div className='title'>
      {forecast && !forecast?.error ? "Weather in " + forecast.location?.name : 'Enter the name of some place'}
    </div>
    <div>
      {isLoading ? <Loading /> : infoBar}
    </div>
    <div className='previews'>
    {previews}
    </div>
  </>);
}

function Preview({ dateString ,imgPath, maxTemperature, minTemperature, onPreviewClick, index}){

  const date = new Date(dateString);

  const displayDate = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
  
  return <div className='preview' onClick={()=>onPreviewClick(index)}>
    <div className='preview-date' >{displayDate}</div>
    <img className="preview-weather" alt="Weather" src={imgPath}/>
    <div className='preview-temperature'>
      <span className='max'>{Math.round(maxTemperature) +  "\u00B0"}</span>
      <span className='min'>{Math.round(minTemperature)+ "\u00B0"}</span>
    </div>
  </div>
}

function SearchBar({ input, hints, onInputChange, onHintClick }) {

  let listItems = hints?.map((item) => {
    return <li key={item.id} ><button className='hint' onClick={() => onHintClick(item.id)}>{item.name + " - " + item.region + ", " + item.country}</button></li>
  });

  listItems = (listItems && listItems?.length < 1) ? (<li key={-1}><button className='hint'>No matches found</button></li>) : listItems;

  if (input === "") {
    listItems = <></>;
  }

  return (<div className='searchBar'>
    <input className='inputField' value={input} onChange={(e) => onInputChange(e.target.value)} ></input>
    <div className='list-container' >
      <ul className="hintList">
        {listItems}
      </ul>
    </div>
  </div>);
}

function InfoBar({ temperature, icon}) {
  return (<>
    <CurrentStatus weatherImg={icon} temperature={temperature} />
    {/* <SunlightPeriodBar sunrise={sunrise} sunset={sunset} /> */}
  </>);
}

function CurrentStatus({ weatherImg, temperature }) {
  return (<div className='status'>

    <img src={weatherImg} alt="Current weather" ></img>
    <span className='temperature'>{temperature + "\u00B0C"}</span>

  </div>);
}

function SunlightPeriodBar({ sunrise, sunset }) {
  return (
  <div className='sunlight-period'>
    <div className='sunrise'>
      <img className='sun-img' src="../assets/images/sunrise.svg" alt="Sunrise"></img>
      <div className='sun-label'>{sunrise}</div>
    </div>
    <div className='sunset'>
      <img className='sun-img' src="../assets/images/sunset.svg" alt="Sunset"></img>
      <div className='sun-label'>{sunset}</div>
    </div>
  </div>);
}

function getWeatherImagePath(pathSnippet){
  const basePath = "../assets/images/weather/64x64/";
  const partialPath = pathSnippet.match(/((night|day)\/(\d)+.png)/i)[0];
  return basePath + partialPath;
}

async function fetchSuggestions(input) {
  const key = "d26e8139afe0475ca10185046241001";
  const response = fetch(`https://api.weatherapi.com/v1/search.json?key=${key}&q=${input}`, {
    referrerPolicy: "strict-origin-when-cross-origin",
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const places = response.then((result) => result.json())
    .catch((error) => console.log(error))
    .then(data => data.length > 0 ? data : []);

  return places;
}

async function fetchForecast(placeId, lang = 'en', days = 3) {

  const key = "d26e8139afe0475ca10185046241001";
  const response = fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=id:${placeId}&lang=${lang}&days=${days}`, {
    referrerPolicy: "strict-origin-when-cross-origin",
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const forecast = response.then((result) => result.json())
    .catch((error) => console.log(error))
    .then(data => data);

  return forecast;

}