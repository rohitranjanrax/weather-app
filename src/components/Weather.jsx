import React, { useEffect, useState } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
  const [city, setCity] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": drizzle_icon,
    "11n": drizzle_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const fetchWeather = async (cityName) => {
    if (cityName.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        setError("City not found");
        setWeather(null);
        setLoading(false);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      const currentDate = new Date().toLocaleString();

      setWeather({
        temp: Math.round(data.main.temp),
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: icon,
        datetime: currentDate,
      });

    } catch (err) {
      setError("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    fetchWeather(city);
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <img src={search_icon} alt="Search" onClick={handleSearch} />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && !loading && (
        <>
          <img src={weather.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weather.temp}°C</p>
          <p className="location">{weather.city}, {weather.country}</p>
          <p className="description">{weather.description}</p>
          <p className="datetime">{weather.datetime}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weather.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weather.wind} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
