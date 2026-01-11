// Weather Alerts Component - МЧС Style Emergency Warnings
import type { WeatherData } from '../services/weatherApi';

interface AlertsProps {
    weather: WeatherData;
}

interface Alert {
    id: string;
    severity: 'warning' | 'danger' | 'critical';
    icon: string;
    title: string;
    message: string;
}

export function WeatherAlerts({ weather }: AlertsProps) {
    const alerts: Alert[] = [];
    const { current } = weather;

    // Check for extreme cold
    if (current.temperature <= -25) {
        alerts.push({
            id: 'extreme-cold',
            severity: 'critical',
            icon: '🥶',
            title: 'Сильный мороз',
            message: `${current.temperature}°C — Опасно для здоровья! Ограничьте время на улице.`
        });
    } else if (current.temperature <= -15) {
        alerts.push({
            id: 'cold',
            severity: 'warning',
            icon: '❄️',
            title: 'Мороз',
            message: `${current.temperature}°C — Одевайтесь тепло, закрывайте лицо.`
        });
    }

    // Check for extreme heat
    if (current.temperature >= 35) {
        alerts.push({
            id: 'extreme-heat',
            severity: 'critical',
            icon: '🔥',
            title: 'Сильная жара',
            message: `${current.temperature}°C — Избегайте солнца, пейте много воды!`
        });
    } else if (current.temperature >= 30) {
        alerts.push({
            id: 'heat',
            severity: 'warning',
            icon: '☀️',
            title: 'Жара',
            message: `${current.temperature}°C — Избегайте длительного нахождения на солнце.`
        });
    }

    // Thunderstorm
    if (current.weatherCode >= 95) {
        alerts.push({
            id: 'storm',
            severity: 'danger',
            icon: '⛈️',
            title: 'Гроза',
            message: 'Оставайтесь в помещении! Не укрывайтесь под деревьями.'
        });
    }

    // Strong wind
    if (current.windSpeed >= 60) {
        alerts.push({
            id: 'strong-wind',
            severity: 'danger',
            icon: '💨',
            title: 'Штормовой ветер',
            message: `${current.windSpeed} км/ч — Опасно! Избегайте открытых пространств.`
        });
    } else if (current.windSpeed >= 40) {
        alerts.push({
            id: 'wind',
            severity: 'warning',
            icon: '🌬️',
            title: 'Сильный ветер',
            message: `${current.windSpeed} км/ч — Будьте осторожны на улице.`
        });
    }

    // Heavy snow
    if (current.weatherCode >= 71 && current.weatherCode <= 77 && current.temperature < 0) {
        alerts.push({
            id: 'snow',
            severity: 'warning',
            icon: '🌨️',
            title: 'Снегопад',
            message: 'Возможны заносы на дорогах. Будьте осторожны.'
        });
    }

    // Freezing rain / ice
    if ((current.weatherCode >= 66 && current.weatherCode <= 67) ||
        (current.weatherCode >= 56 && current.weatherCode <= 57)) {
        alerts.push({
            id: 'ice',
            severity: 'danger',
            icon: '🧊',
            title: 'Гололёд',
            message: 'Опасность на дорогах и тротуарах! Передвигайтесь осторожно.'
        });
    }

    // Heavy rain
    if ((current.weatherCode >= 65 && current.weatherCode <= 67) ||
        (current.weatherCode >= 82 && current.weatherCode <= 82)) {
        alerts.push({
            id: 'heavy-rain',
            severity: 'warning',
            icon: '🌧️',
            title: 'Сильный дождь',
            message: 'Возможны подтопления. Берите зонт!'
        });
    }

    // High UV
    if (current.uvIndex >= 8) {
        alerts.push({
            id: 'uv',
            severity: 'warning',
            icon: '☀️',
            title: 'Высокий UV-индекс',
            message: `UV ${current.uvIndex} — Используйте солнцезащитный крем и очки.`
        });
    }

    // Fog
    if (current.weatherCode === 45 || current.weatherCode === 48) {
        alerts.push({
            id: 'fog',
            severity: 'warning',
            icon: '🌫️',
            title: 'Туман',
            message: 'Плохая видимость на дорогах. Включите фары.'
        });
    }

    if (alerts.length === 0) return null;

    return (
        <div className="weather-alerts">
            {alerts.map(alert => (
                <div key={alert.id} className={`alert-banner ${alert.severity}`}>
                    <span className="alert-icon">{alert.icon}</span>
                    <div className="alert-content">
                        <strong>{alert.title}</strong>
                        <p>{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
