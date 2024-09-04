import Loading from './Loading';
import { useState } from 'react';
import { fetchForecast, fetchSuggestions, getWeatherImagePath } from '../helper';
import SearchBar from './SearchBar';
import Preview from './Preview';
import InfoBar from './InfoBar';

export default function Box() {
    const [input, setInput] = useState('');
    const [forecast, setForecast] = useState(null);
    const [hints, setHints] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [forecastDay, setForecastDay] = useState(null);
  
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
          setForecastDay(forecast.forecast.forecastday[0]);
        }
      });
    }
  
    function handlePreviewClick(index) {
      setForecastDay(forecast.forecast.forecastday[index]);
    }

    console.log(forecast);
  
    let infoBar = <></>;
    let previews = <></>;
  
    if (forecast && !forecast?.error) {
  
      previews = forecast.forecast.forecastday?.map((element, index) => {
        const previewIcon = getWeatherImagePath(element.day.condition.icon);
        return <Preview key={index} index={index} onPreviewClick={handlePreviewClick} dateString={element.date} imgPath={previewIcon} maxTemperature={element.day.maxtemp_c} minTemperature={element.day.mintemp_c} />
      });
  
      const current = {
        temp_c : forecast.current.temp_c,
        icon : forecast.current.condition.icon,
        last_upd : forecast.current.last_updated
      }

      infoBar = <InfoBar forecastDay={forecastDay} current={current} />
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