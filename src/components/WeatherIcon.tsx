// Weather Icons using Emojis - Simple and Universal

interface WeatherIconProps {
    code: number;
    isDay?: boolean;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export function WeatherIcon({ code, isDay = true, size = 'medium', className = '' }: WeatherIconProps) {
    const sizeMap = { small: 24, medium: 36, large: 72 };
    const fontSize = sizeMap[size];

    const getEmoji = (): string => {
        // Clear (0-1)
        if (code <= 1) return isDay ? '☀️' : '🌙';
        // Partly cloudy (2)
        if (code === 2) return isDay ? '⛅' : '☁️';
        // Cloudy (3)
        if (code === 3) return '☁️';
        // Fog (45, 48)
        if (code === 45 || code === 48) return '🌫️';
        // Drizzle (51-57)
        if (code >= 51 && code <= 57) return '🌦️';
        // Rain (61-67, 80-82)
        if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
        // Snow (71-77, 85-86)
        if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '🌨️';
        // Thunderstorm (95-99)
        if (code >= 95) return '⛈️';
        // Default
        return isDay ? '☀️' : '🌙';
    };

    return (
        <div
            className={`weather-icon ${className}`}
            style={{
                width: fontSize,
                height: fontSize,
                fontSize: fontSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
            }}
        >
            {getEmoji()}
        </div>
    );
}
