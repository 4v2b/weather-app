export default function CurrentStatus({ weatherImg, temperature }) {
    return (<div className='status'>
      <img className='current-weather-image' src={weatherImg} alt="Current weather" ></img>
      <span className='temperature'>{temperature + "\u00B0C"}</span>
    </div>);
  }