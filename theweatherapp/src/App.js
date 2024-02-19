import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [weatherStation,setWeatherStation] = useState('');
  const [currentWeatherData,setCurrentWeatherData] = useState({});
  const [pastWeatherData,setPastWeatherData] = useState([]);
  const [currentDateTime,setCurrentDateTime] = useState('');
  const [tempUnits,setTempUnits] = useState('C');
  const [displayTempUnits,setDisplayTempUnits] = useState('');
  
  //Function that calls the API to get the current and historical weather
  async function getWeather() {
    var T = document.getElementById("results");
    T.style.display="hide";
    setDisplayTempUnits(tempUnits);
    setCurrentDateTime(new Date().toLocaleString());
    const isUsingF = tempUnits==='F'?'true':'false';
    const currWeather = await axios.get('http://localhost:8000/api/currentWeather?station='+weatherStation+'&useF='+isUsingF);
    const pastWeather = await axios.get('http://localhost:8000/api/pastWeather?station='+weatherStation+'&useF='+isUsingF);

    setCurrentWeatherData(currWeather.data);
    setPastWeatherData(pastWeather.data.observations);
    
    T.style.display="block";
  }

  //Updates the units when the temp units are changed
  function onChangeValue(event) {
    setTempUnits(event.target.value);
    console.log("Using "+event.target.value+" for temperature units");
  }
  
  //UI page that is rendered
  return (
    <div className="theWeatherApp">
      <h1>The Weather App</h1>
      <div class='row'>
        <p2>Enter Weather Station to get current weather</p2>
        <input class="form-control" placeholder='Enter Weather Station' onChange={e => setWeatherStation(e.target.value)}  value={weatherStation}/>
        <button class="clicker" onClick={getWeather}>Get Weather</button>
      </div>
      <div onChange={onChangeValue}>
        <h3>Select Temperature Units</h3>
        <input type="radio"
          name="unit"
          value="C"
          checked={tempUnits==='C'}
          id="C"
          defaultChecked />
        <label>C</label>
        <input type="radio"
          name="unit"
          value="F"
          checked={tempUnits==='F'}
          id="F"/>
        <label>F</label>
      </div>
      <div id="results" class="results">
        <h2>Current Weather</h2>
        <table>
          <thead>
            <tr>
              <th>Current Date/Time</th>
              <th>Current Temperature ({ displayTempUnits })</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ currentDateTime }</td>
              <td>{ Math.round(currentWeatherData.temperature) }</td>
              <td>{ currentWeatherData.description }</td>
            </tr>
          </tbody>
        </table>
        <h2>Past Weather Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Temperature ({ displayTempUnits })</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {pastWeatherData.map(item => {
              return (
                <tr>
                  <td>{ item.obsDateTime }</td>
                  <td>{ Math.round(item.temperature) }</td>
                  <td>{ item.description }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
