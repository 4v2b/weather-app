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
  const [data, setData] = useState(null);
  const [hints, setHints] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    fetchForecast(placeId).then((data) => {
      if (!data?.error) {
        setData(data);
        setIsLoading(false);
      }
    });
  }

  let infoBar = <></>;

  if (data && !data?.error) {

    const basePath = "../assets/images/weather/64x64/";
    const partialPath = data.current.condition.icon.match(/((night|day)\/(\d)+.png)/i)[0];

    const icon = basePath + partialPath;

    infoBar = <InfoBar temperature={data.current.temp_c} icon={icon} />
  }

  return (<>
    <SearchBar input={input} hints={hints} onInputChange={handleInput} onHintClick={handleClick} />

    <div className='title'>
      {data && !data?.error ? "Weather in " + data.location?.name : 'Enter the name of some place'}
    </div>
    <div>
      {isLoading ? <Loading /> : infoBar}
    </div>
    <div className='forecast-preview'>

    </div>
  </>);
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

// async function fetchAll(placeId, lang = 'eu') {
//   const weather = await fetchWeather(placeId, lang);
//   weather.astro = await fetchAstro(placeId).then(data => data.astronomy.astro);
//   return weather;
// }

// async function fetchAstro(placeId) {
//   const key = "d26e8139afe0475ca10185046241001";
//   const response = fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${key}&q=id:${placeId}`, {
//     referrerPolicy: "strict-origin-when-cross-origin",
//     method: 'GET',
//     headers: {
//       "Content-Type": "application/json"
//     }
//   });

//   const astro = response.then((result) => result.json())
//     .catch((error) => console.log(error))
//     .then(data => data);

//   return astro;
// }