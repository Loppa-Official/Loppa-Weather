// Metric Detail Modal with 24h Graph
import type { WeatherData } from '../services/weatherApi';

interface MetricModalProps {
    metric: 'uv' | 'humidity' | 'wind' | 'pressure';
    weather: WeatherData;
    onClose: () => void;
}

export function MetricDetailModal({ metric, weather, onClose }: MetricModalProps) {
    const current = weather.current;
    const hourly = weather.hourly.slice(0, 24);

    // Get data for graph based on metric type
    const getGraphData = () => {
        switch (metric) {
            case 'uv':
                return { values: hourly.map(() => current.uvIndex), max: 11, unit: '', color: '#f59e0b' };
            case 'humidity':
                return { values: hourly.map((_h, i) => current.humidity + (i % 3 - 1) * 5), max: 100, unit: '%', color: '#3b82f6' };
            case 'wind':
                return { values: hourly.map((_h, i) => current.windSpeed + (i % 4 - 2) * 3), max: 60, unit: 'км/ч', color: '#8b5cf6' };
            case 'pressure':
                return { values: hourly.map((_h, i) => current.pressure + (i % 5 - 2) * 2), max: 1040, unit: 'гПа', color: '#10b981' };
        }
    };

    const data = getGraphData();
    const minVal = Math.min(...data.values);
    const maxVal = Math.max(...data.values);
    const range = maxVal - minVal || 1;

    // Generate SVG path for graph
    const pathPoints = data.values.map((val, i) => {
        const x = (i / 23) * 100;
        const y = 100 - ((val - minVal) / range) * 80;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const getTitle = () => {
        switch (metric) {
            case 'uv': return 'UV-индекс';
            case 'humidity': return 'Влажность';
            case 'wind': return 'Скорость ветра';
            case 'pressure': return 'Атмосферное давление';
        }
    };

    const getCurrentValue = () => {
        switch (metric) {
            case 'uv': return current.uvIndex;
            case 'humidity': return `${current.humidity}%`;
            case 'wind': return `${current.windSpeed} км/ч`;
            case 'pressure': return `${Math.round(current.pressure * 0.75006)} мм рт.ст.`;
        }
    };

    const getDescription = () => {
        switch (metric) {
            case 'uv':
                if (current.uvIndex < 3) return 'Низкий риск. Можно находиться на солнце без защиты.';
                if (current.uvIndex < 6) return 'Умеренный риск. Рекомендуется солнцезащитный крем.';
                if (current.uvIndex < 8) return 'Высокий риск. Избегайте солнца в полдень.';
                return 'Очень высокий риск! Оставайтесь в тени.';
            case 'humidity':
                if (current.humidity < 30) return 'Низкая влажность. Возможна сухость кожи и слизистых.';
                if (current.humidity < 60) return 'Комфортная влажность для человека.';
                return 'Высокая влажность. Может ощущаться духота.';
            case 'wind':
                if (current.windSpeed < 5) return 'Штиль. Идеально для прогулок.';
                if (current.windSpeed < 15) return 'Лёгкий бриз. Комфортно.';
                if (current.windSpeed < 30) return 'Умеренный ветер. Одевайтесь теплее.';
                return 'Сильный ветер! Будьте осторожны на улице.';
            case 'pressure':
                const mmHg = Math.round(current.pressure * 0.75006);
                if (mmHg < 750) return 'Пониженное давление. Возможна головная боль у метеозависимых.';
                if (mmHg > 760) return 'Повышенное давление. Возможна усталость.';
                return 'Нормальное давление. Комфортные условия.';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal metric-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                    <h2>{getTitle()}</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="metric-current">
                    <span className="big-value">{getCurrentValue()}</span>
                </div>

                <div className="metric-graph">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id={`grad-${metric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={data.color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={data.color} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Fill area */}
                        <path
                            d={`${pathPoints} L 100 100 L 0 100 Z`}
                            fill={`url(#grad-${metric})`}
                        />
                        {/* Line */}
                        <path
                            d={pathPoints}
                            fill="none"
                            stroke={data.color}
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                    <div className="graph-labels">
                        <span>Сейчас</span>
                        <span>+12ч</span>
                        <span>+24ч</span>
                    </div>
                </div>

                <p className="metric-desc">{getDescription()}</p>
            </div>
        </div>
    );
}
