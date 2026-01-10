import { formatTime } from '../services/weatherApi';
import type { HourlyForecast as HourlyForecastType } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
    hourly: HourlyForecastType[];
    currentHour?: number;
}

export function HourlyForecast({ hourly, currentHour }: HourlyForecastProps) {
    const now = new Date();
    const currentHourIndex = currentHour ?? now.getHours();

    // Filter to show from current hour onwards
    const filteredHourly = hourly.filter((h) => {
        const hour = h.time.getHours();
        const isToday = h.time.toDateString() === now.toDateString();
        return !isToday || hour >= currentHourIndex;
    }).slice(0, 24);

    return (
        <div className="hourly-section fade-in">
            <h2 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                Почасовой прогноз
            </h2>

            <div className="hourly-scroll">
                {filteredHourly.map((hour, index) => {
                    const hourNum = hour.time.getHours();
                    const isCurrent = index === 0;
                    const isDay = hourNum >= 6 && hourNum < 21;

                    return (
                        <div
                            key={hour.time.toISOString()}
                            className={`hourly-item ${isCurrent ? 'current' : ''}`}
                        >
                            <div className="hourly-time">
                                {isCurrent ? 'Сейчас' : formatTime(hour.time)}
                            </div>
                            <div className="hourly-icon">
                                <WeatherIcon
                                    code={hour.weatherCode}
                                    isDay={isDay}
                                    size="small"
                                />
                            </div>
                            <div className="hourly-temp">{hour.temperature}°</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HourlyForecast;
