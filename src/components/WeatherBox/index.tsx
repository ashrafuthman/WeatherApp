import React from 'react';
import type { WeatherBoxProps } from './types';
import { getDayName } from './utils';

const icons = import.meta.glob('../../assets/svgs/*.svg', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

const WeatherBox: React.FC<WeatherBoxProps> = ({ date, icon, temp, loading }) => {
  const iconPath = `../../assets/svgs/${icon}.svg`;
  const fallbackPath = '../../assets/svgs/01d.svg';
  const iconSrc = !loading ? (icons[iconPath] || icons[fallbackPath]) : undefined;

  return (
    <div
      className={`flex flex-col justify-evenly items-center w-[180px] h-[250px] rounded-[30%] bg-[rgba(255,255,255,0.3)] shadow-[3px_0_8px_silver] pb-[10px] ${
        loading ? 'animate-pulse' : ''
      }`}
      aria-busy={!!loading}
      aria-live="polite"
    >
      {loading ? (
        <span
          className="h-[24px] w-[120px] rounded-md bg-white/40"
          aria-hidden="true"
        />
      ) : (
        <h1 className="text-[20px]">{getDayName(date)}</h1>
      )}

      {loading ? (
        <span
          className="w-[100px] h-[100px] rounded-full bg-white/40"
          aria-hidden="true"
        />
      ) : (
        <img src={iconSrc} alt="weather icon" className="w-[100px] h-[100px]" />
      )}

      {loading ? (
        <span
          className="h-[18px] w-[80px] rounded bg-white/40"
          aria-hidden="true"
        />
      ) : (
        <span className="text-[0.93em]">{Math.round(temp - 273.15)}°C</span>
      )}
    </div>
  );
};

export default WeatherBox;
