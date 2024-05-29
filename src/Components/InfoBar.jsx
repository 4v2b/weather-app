import { useState } from "react";
import CurrentStatus from "./CurrentStatus";
import SunlightPeriodBar from "./SunlightPeriodBar";
import { Slider } from "@mui/material";
import { getWeatherImagePath } from "../helper";

export default function InfoBar({ forecastDay }) {
    const [hourForecast, setHourForecast] = useState(null);
  
    const hour = new Date().getHours();
  
    const date = hourForecast ? new Date(forecastDay.date).getDate() : null;
    const oldDate = hourForecast ? new Date(hourForecast.time).getDate() : null;
  
    if (!hourForecast || date !== oldDate) {
      const selectedHour = forecastDay.hour.find((el) => el.time.match(/\b(\d{2}):(\d{2})\b/)[1] == hour);
      setHourForecast(selectedHour);
    }
  
    const icon = hourForecast ? getWeatherImagePath(hourForecast.condition.icon) : "../../assets/images/no_weather.png";
  
    function handleSliderChange(event) {
      const hour = event.target.value === '' ? -1 : Number(event.target.value);
      if (hour === -1) {
        return;
      }
      const selectedHour = forecastDay.hour.find((el) => el.time.match(/\b(\d{2}):(\d{2})\b/)[1] == hour);
      setHourForecast(selectedHour);
    }
  
    const sunrise = forecastDay.astro.sunrise;
    const sunset = forecastDay.astro.sunset;
  
    return (<>
      <div className='date'>{forecastDay.date}</div>
      <CurrentStatus weatherImg={icon} temperature={hourForecast?.temp_c} />
      <SunlightPeriodBar sunrise={sunrise} sunset={sunset} />
      <div>
        <Slider
          sx={{
            width: 200,
            color: '#92C7CF'
          }}
          value={hour}
          valueLabelDisplay="auto"
          min={0}
          max={23}
          marks
          defaultValue={hour}
          onChange={handleSliderChange} />
      </div>
    </>);
  }