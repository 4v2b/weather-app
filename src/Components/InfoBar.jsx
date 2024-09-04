import { useState, useEffect } from "react";
import CurrentStatus from "./CurrentStatus";
import SunlightPeriodBar from "./SunlightPeriodBar";
import { Slider } from "@mui/material";
import { getWeatherImagePath } from "../helper";

export default function InfoBar({ forecastDay, current }) {
  const [hourForecast, setHourForecast] = useState(null);
  const [selectedHour, setSelectedHour] = useState(-1);

  useEffect(() => {
    setHourForecast(null);
    setSelectedHour(-1);
  }, [forecastDay]);

  function handleSliderChange(event) {
    const hour = event.target.value === '' ? -1 : Number(event.target.value);
    setSelectedHour(hour);
    if (hour === -1) {
      return;
    }
    const selectedHourForecast = forecastDay.hour.find((el) => el.time.match(/\b(\d{2}):(\d{2})\b/)[1] == hour);
    setHourForecast(selectedHourForecast);
  }

  if (!hourForecast && selectedHour != -1) {
    const selectedHourForecast = forecastDay.hour.find((el) => el.time.match(/\b(\d{2}):(\d{2})\b/)[1] == selectedHour);
    setHourForecast(selectedHourForecast);
  }

  const date = new Date(forecastDay.date);

  const sunrise = forecastDay.astro.sunrise;
  const sunset = forecastDay.astro.sunset;

  let temperature;

  if(!hourForecast){
    temperature = new Date().getDate() == date.getDate()? current.temp_c : forecastDay.day.avgtemp_c;
  } else {
    temperature = hourForecast.temp_c;
  }

  let icon = "../../assets/images/no_weather.png";

  let timeLabel;

  if (new Date().getDate() == date.getDate() && !hourForecast) {
    icon = getWeatherImagePath(current.icon);
    timeLabel = (<div>Last updated: {new Date(current.last_upd).toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: "numeric" })}</div>);
  } else if (hourForecast != null) {
    icon = getWeatherImagePath(hourForecast.condition.icon);
    timeLabel = (<div>Chosen time: {
      new Date(hourForecast.time)
        .toLocaleString('en-US', { hour: 'numeric', hour12: true })
    }</div>)
  } else {
    if (forecastDay) {
      icon = getWeatherImagePath(forecastDay.day.condition.icon);
    }
    timeLabel = (<div>No specific time chosen</div>)
  }

  return (<>
    <div className='date'>{new Date(forecastDay.date).toLocaleString('en-US', { weekday: "short", year: 'numeric', month: 'long', day: 'numeric' })}</div>
    <CurrentStatus weatherImg={icon} temperature={temperature} />
    <SunlightPeriodBar sunrise={sunrise} sunset={sunset} />
    <div>
      <Slider
        sx={{
          width: 200,
          color: '#92C7CF'
        }}
        value={selectedHour}
        min={0}
        max={23}
        marks
        defaultValue={selectedHour}
        onChange={handleSliderChange} />
    </div>
    {timeLabel}
  </>);
}