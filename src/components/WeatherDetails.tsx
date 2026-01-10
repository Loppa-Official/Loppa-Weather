import type { CurrentWeather as CurrentWeatherType } from '../services/weatherApi';

interface WeatherDetailsProps {
    weather: CurrentWeatherType;
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
    const details = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                </svg>
            ),
            value: `${weather.windSpeed} км/ч`,
            label: 'Ветер'
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
            ),
            value: `${weather.humidity}%`,
            label: 'Влажность'
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ),
            value: weather.uvIndex,
            label: 'UV'
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20" />
                    <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
                </svg>
            ),
            value: `${weather.pressure} гПа`,
            label: 'Давление'
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="5" x2="12" y2="3" />
                </svg>
            ),
            value: `${weather.visibility} км`,
            label: 'Видимость'
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
            ),
            value: weather.feelsLike + '°',
            label: 'Ощущается'
        }
    ];

    return (
        <div className="weather-details fade-in">
            {details.map((detail, index) => (
                <div key={index} className="detail-item">
                    <div className="detail-icon">{detail.icon}</div>
                    <div className="detail-value">{detail.value}</div>
                    <div className="detail-label">{detail.label}</div>
                </div>
            ))}
        </div>
    );
}

export default WeatherDetails;
