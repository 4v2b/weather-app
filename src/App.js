import './App.css';
import { useState } from 'react';

export default function App() {
  return (
    <div className="App">
      <Box/>
    </div>
  );
}

function Box(){
  return (<>
    <SearchBar />
    <Title />
    <InfoBar/>
  </>);
}

function SearchBar({input, onInputChange}){
  return(<></>);
}

function Title({place}){
  return <span>Weather in {place} </span>;
}

function CurrentStatus({weatherImg, temperature}){
  return(<div className='status'>

    <img src={weatherImg}></img>
    <span className='temperature'>{temperature}</span>

  </div>);
}

function InfoBar(){
  return (<>
    <CurrentStatus/>
    <SunlightPeriodBar/>
  </>);
}

function SunlightPeriodBar(){
  return (<></>);
}


