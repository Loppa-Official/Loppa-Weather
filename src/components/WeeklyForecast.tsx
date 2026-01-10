import { formatDate } from '../services/weatherApi';
import type { DailyForecast as DailyForecastType } from '../services/weatherApi';
import { WeatherIcon } from './WeatherIcon';

interface WeeklyForecastProps {
    daily: DailyForecastType[];
}

export function WeeklyForecast({ daily }: WeeklyForecastProps) {
    return (
        <div className="weekly-section fade-in">
            <h2 className="section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Прогноз на 7 дней
            </h2>

            <div className="weekly-list">
                {daily.map((day) => {
                    const dayName = formatDate(day.date, 'day');
                    const dateStr = formatDate(day.date, 'short');

                    return (
                        <div key={day.date.toISOString()} className="weekly-item">
                            <div className="weekly-day">
                                <div>{dayName}</div>
                                <div className="date">{dateStr}</div>
                            </div>

                            <div className="weekly-icon">
                                <WeatherIcon
                                    code={day.weatherCode}
                                    isDay={true}
                                    size="small"
                                />
                            </div>

                            <div className="weekly-temps">
                                <span className="temp-high">{day.tempMax}°</span>
                                {' / '}
                                <span className="temp-low">{day.tempMin}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WeeklyForecast;
