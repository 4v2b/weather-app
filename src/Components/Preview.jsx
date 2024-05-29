export default function Preview({ dateString, imgPath, maxTemperature, minTemperature, onPreviewClick, index }) {

    const date = new Date(dateString);
  
    const displayDate = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
  
    return <div className='preview' onClick={() => onPreviewClick(index)}>
      <div className='preview-date' >{displayDate}</div>
      <img className="preview-weather" alt="Weather" src={imgPath} />
      <div className='preview-temperature'>
        <span className='max'>{Math.round(maxTemperature) + "\u00B0"}</span>
        <span className='min'>{Math.round(minTemperature) + "\u00B0"}</span>
      </div>
    </div>
  }
  