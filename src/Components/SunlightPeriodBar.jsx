export default function SunlightPeriodBar({ sunrise, sunset }) {
    return (
      <div className='sunlight-period'>
        <div className='sunrise'>
          <img className='sun-img' src="../../assets/images/sunrise.svg" alt="Sunrise"></img>
          <div className='sun-label'>{sunrise}</div>
        </div>
        <div className='sunset'>
          <img className='sun-img' src="../../assets/images/sunset.svg" alt="Sunset"></img>
          <div className='sun-label'>{sunset}</div>
        </div>
      </div>);
  }