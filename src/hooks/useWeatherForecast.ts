import { useCallback, useEffect, useRef, useState } from 'react';
import { OPENWEATHER_API_URL, OPENWEATHER_API_KEY } from '../constants';
import type { WeatherDay, WeatherData } from '../types';
import { getDayIndices } from '../utils';


export const useWeatherForecast = () => {
  const [city, setCity] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [days, setDays] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const ctrlRef = useRef<AbortController | null>(null);
  const reqIdRef = useRef(0);

  const reset = useCallback(() => {
    setCity(undefined);
    setCountry(undefined);
    setDays([]);
    setError(undefined);
  }, []);

  const updateState = useCallback((data: WeatherData) => {
    const indices = getDayIndices(data);
    const mapped: WeatherDay[] = indices.map((i) => {
      const { dt_txt, weather, main } = data.list[i];
      const { description, icon } = weather[0];
      return { date: dt_txt, weather_desc: description, icon, temp: main.temp };
    });
    
    setCity(data.city.name);
    setCountry(data.city.country);
    setDays(mapped);
  }, []);

  const fetchForecast = useCallback(async (cityName: string): Promise<boolean> => {
    if (ctrlRef.current) ctrlRef.current.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    setLoading(true);
    setError(undefined);
    const reqId = ++reqIdRef.current;

    try {
      const url =
        `${OPENWEATHER_API_URL}?q=${encodeURIComponent(cityName)}` +
        `&APPID=${OPENWEATHER_API_KEY}`;

      const res = await fetch(url, { signal: ctrl.signal });

      if (reqId !== reqIdRef.current || ctrl.signal.aborted) return false;

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        setError(`HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
        return false;
      }

      const data: WeatherData = await res.json();

      if (reqId !== reqIdRef.current || ctrl.signal.aborted) return false;

      if (data.cod === '200') {
        updateState(data);
        return true;
      }

      setError(`Unexpected response code: ${data.cod}`);
      return false;
    } catch (e: any) {
      if (reqId !== reqIdRef.current) return false;
      if (e?.name === 'AbortError') return false;
      setError(e?.message || 'Failed to fetch forecast');
      return false;
    } finally {
      if (reqId === reqIdRef.current) setLoading(false);
    }
  }, [updateState]);

  useEffect(() => {
    return () => ctrlRef.current?.abort();
  }, []);

  return { city, days, setCity, loading, error, fetchForecast, reset, country, setCountry};
};
