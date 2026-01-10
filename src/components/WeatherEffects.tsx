// Simple transparent weather effects - rain, snow, etc.

interface EffectsProps {
    weatherCode: number;
}

export function WeatherEffects({ weatherCode }: EffectsProps) {
    // Rain (61-67, 80-82, 51-57)
    if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82) || (weatherCode >= 51 && weatherCode <= 57)) {
        return <RainEffect />;
    }
    // Snow (71-77, 85-86)
    if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
        return <SnowEffect />;
    }
    // Storm (95-99)
    if (weatherCode >= 95) {
        return <StormEffect />;
    }
    return null;
}

function RainEffect() {
    return (
        <div className="weather-effects rain-effect">
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="raindrop"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }}
                />
            ))}
        </div>
    );
}

function SnowEffect() {
    return (
        <div className="weather-effects snow-effect">
            {Array.from({ length: 30 }).map((_, i) => (
                <div
                    key={i}
                    className="snowflake"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 3}s`,
                        opacity: 0.3 + Math.random() * 0.5,
                        fontSize: `${4 + Math.random() * 6}px`
                    }}
                />
            ))}
        </div>
    );
}

function StormEffect() {
    return (
        <div className="weather-effects storm-effect">
            <div className="lightning-flash" />
            {Array.from({ length: 15 }).map((_, i) => (
                <div
                    key={i}
                    className="raindrop heavy"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 1}s`,
                        animationDuration: `${0.3 + Math.random() * 0.3}s`
                    }}
                />
            ))}
        </div>
    );
}

export default WeatherEffects;
