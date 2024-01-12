import './App.css';
import { useState } from 'react';

export default function App() {
  return (
    <div className="App">
      <Box />
    </div>
  );
}

function Box() {
  const [input, setInput] = useState('');
  const [data, setData] = useState(null);
  const [hints, setHints] = useState(null);

  const place = data && !data?.error ? data.location?.name : 'unknown';

  async function handleInput(value) {
    fetchSuggestions(value).then((hints) => {
      setHints(hints);
      setInput(value);
    });

  }

  async function handleClick(placeId) {
    fetchAll(placeId).then((data) => {
      if (!data?.error) {
        setData(data);
        setInput("");
        setHints(null);
      }
    });
  }

  let infoBar = <></>;

  if (data && !data?.error) {

    const basePath = "../assets/images/weather/64x64/";
    const partialPath = data.current.condition.icon.match(/((night|day)\/(\d)+.png)/i)[0];

    const icon = basePath + partialPath;

    infoBar = <InfoBar temperature={data.current.temp_c} icon={icon} sunset={data.astro.sunset} sunrise={data.astro.sunrise} />
  }

  return (<>
    <SearchBar input={input} hints={hints} onInputChange={handleInput} onHintClick={handleClick} />
    <Title place={place} />
    {infoBar}
  </>);
}

function SearchBar({ input, hints, onInputChange, onHintClick }) {

  let listItems = hints?.map((item) => {
    return <li key={item.id} ><button className='hint' onClick={() => onHintClick(item.id)}>{item.name + " - " + item.region + ", " + item.country}</button></li>
  });

  listItems = listItems && listItems?.length < 1 ? (<li key={-1}>{"No matches found"}</li>) : listItems;


  return (<>
    <input value={input} onChange={(e) => onInputChange(e.target.value)} ></input>
    <ul className="hintList">
      {listItems}
    </ul>
  </>);
}

function Title({ place }) {
  return <span>Weather in {place} </span>;
}

function CurrentStatus({ weatherImg, temperature }) {
  return (<div className='status'>

    <img src={weatherImg} alt="Current weather" ></img>
    <span className='temperature'>{temperature + "C"}</span>

  </div>);
}

function InfoBar({ temperature, icon, sunrise, sunset }) {
  return (<>
    <CurrentStatus weatherImg={icon} temperature={temperature} />
    <SunlightPeriodBar sunrise={sunrise} sunset={sunset} />
  </>);
}

function SunlightPeriodBar({ sunrise, sunset }) {
  return (<div className='sunlightPeriod'>
    <div className='sunrise'>
      <img src="../assets/images/sunrise.svg"  style={{width:85, heigth:85}}  alt="Sunrise"></img>
      <div>
        {sunrise}
      </div>
    </div>
    <div className='sunset'></div>
    <div className='sunset'>
      <img src="../assets/images/sunset.svg" style={{width:85, heigth:85}} alt="Sunset"></img>
      <div>
        {sunset}
      </div>
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

async function fetchWeather(placeId, lang = 'en') {

  const key = "d26e8139afe0475ca10185046241001";
  const response = fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=id:${placeId}&lang=${lang}`, {
    referrerPolicy: "strict-origin-when-cross-origin",
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const weather = response.then((result) => result.json())
    .catch((error) => console.log(error))
    .then(data => data);

  return weather;

}

async function fetchAll(placeId, lang = 'eu') {
  const weather = await fetchWeather(placeId, lang);
  weather.astro = await fetchAstro(placeId).then(data => data.astronomy.astro);
  return weather;
}

async function fetchAstro(placeId) {
  const key = "d26e8139afe0475ca10185046241001";
  const response = fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${key}&q=id:${placeId}`, {
    referrerPolicy: "strict-origin-when-cross-origin",
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const astro = response.then((result) => result.json())
    .catch((error) => console.log(error))
    .then(data => data);

  return astro;
}