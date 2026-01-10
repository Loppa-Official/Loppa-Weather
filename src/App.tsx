import { useState, useEffect, useCallback, useMemo } from 'react';
import { WeatherIcon } from './components/WeatherIcon';
import { WeatherEffects } from './components/WeatherEffects';
import {
  fetchWeather,
  detectLocation,
  searchCities,
  getWeatherCategory
} from './services/weatherApi';
import type { WeatherData, GeoLocation } from './services/weatherApi';
import { translations, languageNames, type Language } from './i18n/translations';
import './index.css';

interface Settings {
  language: Language;
  units: 'celsius' | 'fahrenheit';
}

// Weather report options
const WEATHER_OPTIONS = [
  { code: 0, icon: '☀️' },
  { code: 3, icon: '☁️' },
  { code: 61, icon: '🌧️' },
  { code: 71, icon: '❄️' },
  { code: 95, icon: '⛈️' },
  { code: 45, icon: '🌫️' },
];

function getSettings(): Settings {
  try {
    const saved = localStorage.getItem('loppo-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { language: parsed.language || 'ru', units: parsed.units || 'celsius' };
    }
  } catch { }
  return { language: 'ru', units: 'celsius' };
}

function saveSettings(settings: Settings) {
  localStorage.setItem('loppo-settings', JSON.stringify(settings));
}

// Save/load last city
function getSavedCity(): { lat: number; lon: number } | null {
  try {
    const saved = localStorage.getItem('loppo-city');
    if (saved) return JSON.parse(saved);
  } catch { }
  return null;
}

function saveCity(lat: number, lon: number) {
  localStorage.setItem('loppo-city', JSON.stringify({ lat, lon }));
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [settings, setSettings] = useState<Settings>(getSettings);
  const [showSettings, setShowSettings] = useState(false);

  // Report weather modal
  const [showReport, setShowReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [district, setDistrict] = useState('');

  const t = useMemo(() => translations[settings.language], [settings.language]);

  const convertTemp = useCallback((temp: number) => {
    if (settings.units === 'fahrenheit') {
      return Math.round(temp * 9 / 5 + 32);
    }
    return temp;
  }, [settings.units]);

  const updateSettings = (partial: Partial<Settings>) => {
    const newSettings = { ...settings, ...partial };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const formatDay = useCallback((date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return t.today;
    if (date.toDateString() === tomorrow.toDateString()) return t.tomorrow;
    const days = [t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat];
    return days[date.getDay()];
  }, [t]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(settings.language === 'en' ? 'en-US' : settings.language, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const loadWeather = useCallback(async (lat: number, lon: number, save = true) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      if (save) saveCity(lat, lon); // Save selected city
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDetectLocation = useCallback(async () => {
    setLoading(true);
    try {
      const location = await detectLocation();
      await loadWeather(location.lat, location.lon);
    } catch {
      setError('Failed to detect location');
      setLoading(false);
    }
  }, [loadWeather]);

  const handleSelectCity = useCallback(async (location: GeoLocation) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSearch(false);
    await loadWeather(location.lat, location.lon);
  }, [loadWeather]);

  // Send weather report (mock - would need backend)
  const handleSendReport = (weatherCode: number) => {
    // In real app, this would send to backend
    console.log('Report:', {
      city: weather?.location.name,
      district,
      weatherCode,
      timestamp: new Date().toISOString()
    });
    setReportSent(true);
    setTimeout(() => {
      setShowReport(false);
      setReportSent(false);
      setDistrict('');
    }, 2000);
  };

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const results = await searchCities(searchQuery);
      setSuggestions(results);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    // Try saved city first, then detect location
    const savedCity = getSavedCity();
    if (savedCity) {
      loadWeather(savedCity.lat, savedCity.lon, false);
    } else {
      handleDetectLocation();
    }
  }, []);

  const weatherCategory = weather
    ? getWeatherCategory(weather.current.weatherCode, weather.current.isDay)
    : 'night';

  const weatherDesc = weather ? (t.weather[weather.current.weatherCode] || '') : '';
  const now = new Date();
  const currentHour = now.getHours();

  const todaySummary = weather ? (() => {
    const today = weather.daily[0];
    const hasSnow = today.weatherCode >= 71 && today.weatherCode <= 77;
    if (hasSnow) return `${t.weather[today.weatherCode]}. ${t.feelsLike} ${convertTemp(weather.current.feelsLike)}°`;
    return `${weatherDesc}. ${t.wind} ${weather.current.windSpeed} км/ч`;
  })() : '';

  return (
    <div className={`app ${weatherCategory}`}>
      <main className="main-container">

        {/* ===== TOP BAR ===== */}
        <header className="top-bar">
          <button className="loc-btn" onClick={() => setShowSearch(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{weather?.location.name || t.loading}</span>
          </button>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => setShowReport(true)} title="Сообщить о погоде">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
            <button className="icon-btn" onClick={() => setShowSettings(true)} title={t.language}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </button>
          </div>
        </header>

        {/* ===== WEATHER EFFECTS (rain/snow overlay) ===== */}
        {weather && <WeatherEffects weatherCode={weather.current.weatherCode} />}

        {/* ===== SEARCH MODAL ===== */}
        {showSearch && (
          <div className="modal-overlay" onClick={() => setShowSearch(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder={t.searchCity}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)}>✕</button>
              </div>
              <button className="detect-btn" onClick={() => { setShowSearch(false); handleDetectLocation(); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
                {t.detectAuto}
              </button>
              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((loc, i) => (
                    <button key={`${loc.lat}-${i}`} onClick={() => handleSelectCity(loc)}>
                      <span className="name">{loc.name}</span>
                      <span className="country">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REPORT WEATHER MODAL ===== */}
        {showReport && (
          <div className="modal-overlay" onClick={() => setShowReport(false)}>
            <div className="modal report-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h2>Сообщить о погоде</h2>
                <button onClick={() => setShowReport(false)}>✕</button>
              </div>

              {!reportSent ? (
                <>
                  <div className="report-section">
                    <label>Район (необязательно)</label>
                    <input
                      type="text"
                      placeholder="Например: Центральный"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="district-input"
                    />
                  </div>

                  <div className="report-section">
                    <label>Какая сейчас погода?</label>
                    <div className="weather-options">
                      {WEATHER_OPTIONS.map(opt => (
                        <button
                          key={opt.code}
                          className="weather-option"
                          onClick={() => handleSendReport(opt.code)}
                        >
                          <span className="opt-icon">{opt.icon}</span>
                          <span className="opt-label">{t.weather[opt.code]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="report-note">
                    Ваш отчёт поможет уточнить погоду для других пользователей в вашем районе
                  </p>
                </>
              ) : (
                <div className="report-success">
                  <span className="success-icon">✓</span>
                  <p>Спасибо! Отчёт отправлен</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== SETTINGS MODAL ===== */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal settings" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h2>{t.settings}</h2>
                <button onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="setting-group">
                <label>{t.language}</label>
                <div className="lang-grid">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button key={code} className={settings.language === code ? 'active' : ''} onClick={() => updateSettings({ language: code as Language })}>{name}</button>
                  ))}
                </div>
              </div>
              <div className="setting-group">
                <label>{t.units}</label>
                <div className="toggle-row">
                  <button className={settings.units === 'celsius' ? 'active' : ''} onClick={() => updateSettings({ units: 'celsius' })}>°C</button>
                  <button className={settings.units === 'fahrenheit' ? 'active' : ''} onClick={() => updateSettings({ units: 'fahrenheit' })}>°F</button>
                </div>
              </div>
              <div className="about">Loppa Wether v1.4</div>
            </div>
          </div>
        )}

        {loading && !weather && (
          <div className="loading">
            <div className="spinner" />
            <p>{t.detectingLocation}</p>
          </div>
        )}

        {error && !weather && (
          <div className="error">
            <p>{error}</p>
            <button onClick={handleDetectLocation}>{t.retry}</button>
          </div>
        )}

        {weather && (
          <>
            {/* ===== HERO: TODAY ===== */}
            <section className="hero">
              <div className="temp-row">
                <span className="big-temp">{convertTemp(weather.current.temperature)}°</span>
                <div className="hero-icon">
                  <WeatherIcon code={weather.current.weatherCode} isDay={weather.current.isDay} size="large" />
                </div>
              </div>
              <div className="weather-info">
                <span className="desc">{weatherDesc}</span>
                <span className="range">↑{convertTemp(weather.daily[0].tempMax)}° / ↓{convertTemp(weather.daily[0].tempMin)}°</span>
                <span className="feels">{t.feelsLike} {convertTemp(weather.current.feelsLike)}°</span>
              </div>
            </section>

            {/* ===== TODAY SUMMARY ===== */}
            <section className="summary-card">
              <p>{todaySummary}</p>
            </section>

            {/* ===== HOURLY ===== */}
            <section className="hourly-card">
              <div className="hourly-row">
                {weather.hourly
                  .filter((h) => h.time.getHours() >= currentHour || h.time.getDate() !== now.getDate())
                  .slice(0, 8)
                  .map((hour, idx) => {
                    const hourNum = hour.time.getHours();
                    const isNight = hourNum < 6 || hourNum >= 21;
                    return (
                      <div key={hour.time.toISOString()} className={`hour ${idx === 0 ? 'now' : ''} ${isNight ? 'night' : ''}`}>
                        <span className="time">{idx === 0 ? 'Сейчас' : formatTime(hour.time)}</span>
                        <div className="h-icon">
                          <WeatherIcon code={hour.weatherCode} isDay={!isNight} size="small" />
                        </div>
                        <span className="h-temp">{convertTemp(hour.temperature)}°</span>
                        {hour.precipitation > 0 && <span className="precip">💧{hour.precipitation}%</span>}
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* ===== TIPS CARD (contextual advice) ===== */}
            <section className="tips-card">
              <div className="tip">
                {weather.current.temperature < 0 ? (
                  <>
                    <div className="tip-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 17h2l3-6 3 6h2l-4-8h-2l-4 8zm5-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>
                    </div>
                    <div className="tip-content">
                      <span className="tip-title">🚗 Прогрев авто</span>
                      <span className="tip-text">При {convertTemp(weather.current.temperature)}° рекомендуется прогреть двигатель 3-5 минут</span>
                    </div>
                  </>
                ) : weather.current.weatherCode >= 61 && weather.current.weatherCode <= 67 ? (
                  <>
                    <div className="tip-icon rain">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                    </div>
                    <div className="tip-content">
                      <span className="tip-title">☔ Не забудьте зонт</span>
                      <span className="tip-text">Ожидаются осадки. Вероятность дождя высока</span>
                    </div>
                  </>
                ) : weather.current.weatherCode >= 71 && weather.current.weatherCode <= 77 ? (
                  <>
                    <div className="tip-icon snow">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 9H2l6 4.5L5 22l7-5 7 5-3-8.5 6-4.5h-7z" /></svg>
                    </div>
                    <div className="tip-content">
                      <span className="tip-title">⚠️ Возможен гололёд</span>
                      <span className="tip-text">Снег на дорогах. Будьте осторожны за рулём</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tip-icon good">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                    </div>
                    <div className="tip-content">
                      <span className="tip-title">✅ Хорошая погода</span>
                      <span className="tip-text">Отличные условия для прогулки</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ===== ACTIVITY CARDS ===== */}
            <section className="activity-section">
              <h3>Активности</h3>
              {(() => {
                const temp = weather.current.temperature;
                const code = weather.current.weatherCode;
                const wind = weather.current.windSpeed;
                const uv = weather.current.uvIndex;
                const isRaining = code >= 51 && code <= 67 || code >= 80 && code <= 82;
                const isSnowing = code >= 71 && code <= 86;
                const isStorm = code >= 95;
                const isFog = code === 45 || code === 48;
                const isClear = code <= 1;

                // Running conditions
                const runOk = temp > 0 && temp < 28 && !isRaining && !isSnowing && !isStorm && wind < 40;
                const getRunStatus = () => {
                  if (runOk) return temp > 15 && temp < 22 ? 'Идеально!' : 'Подходит';
                  if (isRaining) return 'Дождь';
                  if (isSnowing) return 'Снег';
                  if (temp <= 0) return `${temp}° холодно`;
                  if (temp >= 28) return 'Жарко';
                  if (wind >= 40) return 'Ветрено';
                  return 'Не лучший';
                };

                // Cycling conditions
                const bikeOk = temp > 5 && temp < 30 && !isRaining && !isSnowing && !isStorm && wind < 30;
                const getBikeStatus = () => {
                  if (bikeOk) return isClear && temp > 15 ? 'Отлично!' : 'Можно';
                  if (isRaining || isSnowing) return 'Опасно';
                  if (temp <= 5) return 'Холодно';
                  if (wind >= 30) return 'Ветер';
                  return 'Не сезон';
                };

                // Beach conditions  
                const beachOk = temp > 22 && uv > 0 && uv < 8 && !isRaining && !isStorm && isClear;
                const getBeachStatus = () => {
                  if (beachOk) return uv < 5 ? 'Идеально!' : 'UV ' + uv;
                  if (temp <= 22) return `${temp}° мало`;
                  if (isRaining) return 'Дождь';
                  if (uv >= 8) return 'UV опасен';
                  return 'Не сезон';
                };

                // Driving conditions
                const driveOk = !isStorm && !isFog && !(isSnowing && temp < -3) && wind < 60;
                const getDriveStatus = () => {
                  if (driveOk) return isClear ? 'Отлично' : 'Норм';
                  if (isStorm) return '⚠️ Гроза';
                  if (isFog) return '⚠️ Туман';
                  if (isSnowing && temp < -3) return '⚠️ Гололёд';
                  if (wind >= 60) return '⚠️ Ветер';
                  return 'Осторожно';
                };

                return (
                  <div className="activity-grid">
                    <div className={`activity-card ${runOk ? 'good' : 'bad'}`}>
                      <div className="act-icon">🏃</div>
                      <span className="act-name">Бег</span>
                      <span className={`act-status ${runOk ? 'ok' : 'no'}`}>{getRunStatus()}</span>
                    </div>
                    <div className={`activity-card ${bikeOk ? 'good' : 'bad'}`}>
                      <div className="act-icon">🚴</div>
                      <span className="act-name">Велосипед</span>
                      <span className={`act-status ${bikeOk ? 'ok' : 'no'}`}>{getBikeStatus()}</span>
                    </div>
                    <div className={`activity-card ${beachOk ? 'good' : 'bad'}`}>
                      <div className="act-icon">🏖️</div>
                      <span className="act-name">Пляж</span>
                      <span className={`act-status ${beachOk ? 'ok' : 'no'}`}>{getBeachStatus()}</span>
                    </div>
                    <div className={`activity-card ${driveOk ? 'good' : 'bad'}`}>
                      <div className="act-icon">🚗</div>
                      <span className="act-name">Поездка</span>
                      <span className={`act-status ${driveOk ? 'ok' : 'no'}`}>{getDriveStatus()}</span>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* ===== DETAILED METRICS ===== */}
            <section className="metrics-section">
              <div className="metric-card">
                <div className="metric-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" /></svg>
                  <span>UV-индекс</span>
                </div>
                <span className="metric-value">{weather.current.uvIndex < 3 ? 'Низкий' : weather.current.uvIndex < 6 ? 'Умеренный' : 'Высокий'}</span>
                <div className="uv-bar">
                  <div className="uv-fill" style={{ width: `${Math.min(100, weather.current.uvIndex * 10)}%` }} />
                  <span className="uv-num">{weather.current.uvIndex}</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                  <span>Влажность</span>
                </div>
                <span className="metric-value">{weather.current.humidity}%</span>
                <div className="humidity-bar">
                  <div className="humidity-fill" style={{ width: `${weather.current.humidity}%` }} />
                </div>
              </div>
            </section>

            <section className="metrics-section">
              <div className="metric-card wide">
                <div className="metric-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>
                  <span>Ветер</span>
                </div>
                <div className="wind-info">
                  <span className="wind-speed">{weather.current.windSpeed}</span>
                  <span className="wind-unit">км/ч</span>
                  <span className="wind-desc">
                    {weather.current.windSpeed < 5 ? 'Штиль' :
                      weather.current.windSpeed < 15 ? 'Лёгкий бриз' :
                        weather.current.windSpeed < 30 ? 'Умеренный' : 'Сильный'}
                  </span>
                </div>
              </div>

              <div className="metric-card wide">
                <div className="metric-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <span>Давление</span>
                </div>
                <div className="pressure-info">
                  <span className="pressure-value">{weather.current.pressure}</span>
                  <span className="pressure-unit">гПа</span>
                  <span className="pressure-desc">
                    {weather.current.pressure > 1015 ? '↑ Повышенное' :
                      weather.current.pressure < 1005 ? '↓ Пониженное' : '→ Норма'}
                  </span>
                </div>
              </div>
            </section>

            {/* ===== WEEKLY ===== */}
            <section className="weekly-card">
              <h3>{t.tenDays}</h3>
              <div className="week-list">
                {weather.daily.map((day, idx) => (
                  <div key={day.date.toISOString()} className={`week-row ${idx === 0 ? 'today' : ''}`}>
                    <span className="day">{formatDay(day.date)}</span>
                    <div className="w-icon">
                      <WeatherIcon code={day.weatherCode} isDay={true} size="small" />
                    </div>
                    <span className="max">{convertTemp(day.tempMax)}°</span>
                    <div className="bar"><div className="fill" style={{ width: `${Math.min(100, Math.max(20, ((day.tempMax - day.tempMin) / 20) * 100))}%` }} /></div>
                    <span className="min">{convertTemp(day.tempMin)}°</span>
                  </div>
                ))}
              </div>
            </section>
            {/* ===== API CREDIT ===== */}
            <footer className="api-credit">
              Данные: <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
