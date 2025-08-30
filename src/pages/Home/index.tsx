import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import MainWeatherWindow from '../../components/MainWeatherWindow';
import CityInput from '../../components/CityInput';
import { useWeatherForecast } from '../../hooks/useWeatherForecast';
import type { WeatherDay } from '../../types';

const WeatherBox = lazy(() => import('../../components/WeatherBox'));

const WeatherLoadingStateBoxes: React.FC = () => (
  <ul className="flex flex-col md:flex-row gap-4 mt-4 py-[40px]">
    {[...Array(4)].map((_, i) => (
      <li key={i}>
        <WeatherBox loading date="" icon="" temp={0} />
      </li>
    ))}
  </ul>
);

const WeatherBoxes: React.FC<{ days: WeatherDay[] }> = ({ days }) => (
  <Suspense fallback={<WeatherLoadingStateBoxes />}>
    <ul className="flex flex-col md:flex-row gap-4 mt-4 py-[40px]">
      {days.slice(1).map((day, idx) => (
        <li key={idx}>
          <WeatherBox {...day} />
        </li>
      ))}
    </ul>
  </Suspense>
);

const useDebounce = <T,>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

const Home: React.FC = () => {
  const { city, days, loading, error, fetchForecast, country } = useWeatherForecast();

  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery !== city) {
      fetchForecast(debouncedQuery);
    }
  }, [debouncedQuery, city, fetchForecast]);

  const submitNow = useCallback(() => {
    if (query) fetchForecast(query);
  }, [query, fetchForecast]);


  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
      <MainWeatherWindow data={days[0]} city={city} country={country}>
        <CityInput
          value={query}
          onChange={setQuery}
          onSubmit={submitNow}
            loading={loading}
          />
            <div>
              <div className="mt-2 !text-red-600 !font-semibold text-sm">
                {error}
              </div>
              {loading ? <WeatherLoadingStateBoxes /> : !error && <WeatherBoxes days={days} />}
          </div>
        </MainWeatherWindow>
      </div>
    </div>
  );
};

export default Home;
