// Open-Meteo API Service + IP Geolocation
// Определение местоположения по IP как fallback

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  uvIndex: number;
  pressure: number;
  visibility: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  weatherCode: number;
  precipitation: number;
}

export interface DailyForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationSum: number;
  uvIndexMax: number;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
}

export interface GeoLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
  admin1?: string;
}

// Weather codes mapping
export const weatherCodes: Record<number, { description: string; icon: string; category: string }> = {
  0: { description: 'Ясно', icon: 'clear', category: 'sunny' },
  1: { description: 'Преим. ясно', icon: 'mostly-clear', category: 'sunny' },
  2: { description: 'Переменная облачность', icon: 'partly-cloudy', category: 'cloudy' },
  3: { description: 'Пасмурно', icon: 'overcast', category: 'cloudy' },
  45: { description: 'Туман', icon: 'fog', category: 'foggy' },
  48: { description: 'Изморозь', icon: 'fog', category: 'foggy' },
  51: { description: 'Лёгкая морось', icon: 'drizzle', category: 'rainy' },
  53: { description: 'Морось', icon: 'drizzle', category: 'rainy' },
  55: { description: 'Сильная морось', icon: 'drizzle', category: 'rainy' },
  56: { description: 'Ледяная морось', icon: 'freezing-drizzle', category: 'snowy' },
  57: { description: 'Сильная ледяная морось', icon: 'freezing-drizzle', category: 'snowy' },
  61: { description: 'Небольшой дождь', icon: 'rain-light', category: 'rainy' },
  63: { description: 'Дождь', icon: 'rain', category: 'rainy' },
  65: { description: 'Сильный дождь', icon: 'rain-heavy', category: 'rainy' },
  66: { description: 'Ледяной дождь', icon: 'freezing-rain', category: 'snowy' },
  67: { description: 'Сильный ледяной дождь', icon: 'freezing-rain', category: 'snowy' },
  71: { description: 'Небольшой снег', icon: 'snow-light', category: 'snowy' },
  73: { description: 'Снег', icon: 'snow', category: 'snowy' },
  75: { description: 'Сильный снег', icon: 'snow-heavy', category: 'snowy' },
  77: { description: 'Снежные зёрна', icon: 'snow-grains', category: 'snowy' },
  80: { description: 'Ливень', icon: 'showers-light', category: 'rainy' },
  81: { description: 'Умеренный ливень', icon: 'showers', category: 'rainy' },
  82: { description: 'Сильный ливень', icon: 'showers-heavy', category: 'rainy' },
  85: { description: 'Снегопад', icon: 'snow-showers', category: 'snowy' },
  86: { description: 'Сильный снегопад', icon: 'snow-showers-heavy', category: 'snowy' },
  95: { description: 'Гроза', icon: 'thunderstorm', category: 'stormy' },
  96: { description: 'Гроза с градом', icon: 'thunderstorm-hail', category: 'stormy' },
  99: { description: 'Сильная гроза с градом', icon: 'thunderstorm-hail-heavy', category: 'stormy' },
};

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEO_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

// Cache settings - 15 minutes
const CACHE_TTL = 15 * 60 * 1000;
const CACHE_KEY_PREFIX = 'loppa-weather-cache-';

interface CachedData {
  data: WeatherData;
  timestamp: number;
}

function getCacheKey(lat: number, lon: number): string {
  return `${CACHE_KEY_PREFIX}${lat.toFixed(2)}-${lon.toFixed(2)}`;
}

function getFromCache(lat: number, lon: number): WeatherData | null {
  try {
    const key = getCacheKey(lat, lon);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsed: CachedData = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;

    if (age > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    // Restore Date objects
    parsed.data.hourly = parsed.data.hourly.map(h => ({ ...h, time: new Date(h.time) }));
    parsed.data.daily = parsed.data.daily.map(d => ({ ...d, date: new Date(d.date) }));

    console.log(`[Cache] Using cached data (${Math.round(age / 1000)}s old)`);
    return parsed.data;
  } catch {
    return null;
  }
}

function saveToCache(lat: number, lon: number, data: WeatherData): void {
  try {
    const key = getCacheKey(lat, lon);
    const cached: CachedData = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cached));
    console.log('[Cache] Weather data cached for 15 minutes');
  } catch {
    // Storage full or unavailable
  }
}

// Fetch weather data (with caching)
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  // Check cache first
  const cached = getFromCache(lat, lon);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
      'surface_pressure',
      'visibility',
      'is_day'
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'uv_index_max'
    ].join(','),
    timezone: 'auto',
    forecast_days: '10'
  });

  const response = await fetch(`${WEATHER_API_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('Не удалось загрузить данные о погоде');
  }

  const data = await response.json();
  const location = await reverseGeocode(lat, lon);

  const result: WeatherData = {
    location,
    current: {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
      uvIndex: Math.round(data.current.uv_index || 0),
      pressure: Math.round(data.current.surface_pressure),
      visibility: Math.round((data.current.visibility || 10000) / 1000),
      isDay: data.current.is_day === 1
    },
    hourly: data.hourly.time.slice(0, 48).map((time: string, i: number) => ({
      time: new Date(time),
      temperature: Math.round(data.hourly.temperature_2m[i]),
      weatherCode: data.hourly.weather_code[i],
      precipitation: data.hourly.precipitation_probability?.[i] || 0
    })),
    daily: data.daily.time.map((date: string, i: number) => ({
      date: new Date(date),
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      weatherCode: data.daily.weather_code[i],
      precipitationSum: data.daily.precipitation_sum[i],
      uvIndexMax: Math.round(data.daily.uv_index_max?.[i] || 0)
    })),
    timezone: data.timezone
  };

  // Save to cache before returning
  saveToCache(lat, lon, result);
  return result;
}

// Search cities
export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'ru',
    format: 'json'
  });

  try {
    const response = await fetch(`${GEO_API_BASE}?${params}`);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((r: any) => ({
      name: r.name,
      country: r.country || '',
      lat: r.latitude,
      lon: r.longitude,
      admin1: r.admin1
    }));
  } catch {
    return [];
  }
}

// Reverse geocode
async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string; lat: number; lon: number }> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`);

    if (response.ok) {
      const data = await response.json();
      return {
        name: data.address?.city || data.address?.town || data.address?.village || data.address?.state || 'Текущее место',
        country: data.address?.country || '',
        lat,
        lon
      };
    }
  } catch {
    // Fallback
  }

  return { name: 'Текущее место', country: '', lat, lon };
}

// ===== IP-BASED GEOLOCATION =====
// Определение местоположения по IP — работает без разрешений!
export async function getLocationByIP(): Promise<GeoLocation> {
  try {
    // Используем бесплатный сервис ip-api.com
    const response = await fetch('http://ip-api.com/json/?lang=ru&fields=status,country,city,lat,lon,regionName');

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return {
          name: data.city || data.regionName || 'Неизвестно',
          country: data.country || '',
          lat: data.lat,
          lon: data.lon
        };
      }
    }
  } catch {
    // Try backup service
  }

  try {
    // Backup: ipapi.co (HTTPS)
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        name: data.city || data.region || 'Неизвестно',
        country: data.country_name || '',
        lat: data.latitude,
        lon: data.longitude
      };
    }
  } catch {
    // Fallback to Moscow
  }

  // Default fallback
  return {
    name: 'Москва',
    country: 'Россия',
    lat: 55.7558,
    lon: 37.6173
  };
}

// Get GPS position
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 600000
    });
  });
}

// Smart location detection: GPS first, then IP
export async function detectLocation(): Promise<GeoLocation> {
  // Try GPS first (faster if available)
  try {
    const position = await getCurrentPosition();
    const location = await reverseGeocode(
      position.coords.latitude,
      position.coords.longitude
    );
    return {
      name: location.name,
      country: location.country,
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
  } catch {
    // GPS failed, use IP
    console.log('GPS unavailable, using IP geolocation');
  }

  // Fallback to IP geolocation
  return await getLocationByIP();
}

// Get weather category
export function getWeatherCategory(weatherCode: number, isDay: boolean): string {
  const info = weatherCodes[weatherCode];
  if (!info) return isDay ? 'sunny' : 'night';

  if (!isDay && (info.category === 'sunny' || info.category === 'cloudy')) {
    return 'night';
  }

  return info.category;
}

// Format date
export function formatDate(date: Date, format: 'full' | 'short' | 'day' | 'weekday' = 'full'): string {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const daysShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (format === 'day') {
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
    return daysShort[date.getDay()];
  }

  if (format === 'weekday') {
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
    return days[date.getDay()];
  }

  if (format === 'short') {
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

// Format time
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
