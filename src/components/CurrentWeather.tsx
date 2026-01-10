import { WeatherIcon } from './WeatherIcon';
import { weatherCodes, formatDate } from '../services/weatherApi';
import type { CurrentWeather as CurrentWeatherType } from '../services/weatherApi';

interface CurrentWeatherProps {
    weather: CurrentWeatherType;
    locationName: string;
    country: string;
}

export function CurrentWeather({ weather, locationName, country }: CurrentWeatherProps) {
    const weatherInfo = weatherCodes[weather.weatherCode] || weatherCodes[0];
    const now = new Date();

    return (
        <div className="current-weather slide-up">
            <h1 className="location-name">
                {locationName}
                {country && <span style={{ opacity: 0.7, fontWeight: 400 }}>, {country}</span>}
            </h1>
            <p className="current-date">{formatDate(now)}</p>

            <div className="weather-icon-large">
                <WeatherIcon
                    code={weather.weatherCode}
                    isDay={weather.isDay}
                    size="large"
                />
            </div>

            <div className="temperature-main">
                {weather.temperature}<span className="degree">°</span>
            </div>

            <p className="weather-description">{weatherInfo.description}</p>
            <p className="feels-like">Ощущается как {weather.feelsLike}°</p>
        </div>
    );
}

export default CurrentWeather;
