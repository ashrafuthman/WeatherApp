import React, { useMemo } from 'react';
import titleIconUrl from '../../assets/svgs/02d.svg';
import type { MainWeatherWindowProps } from './types';

const icons = import.meta.glob('../../assets/svgs/*.svg', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

const MainWeatherWindow: React.FC<MainWeatherWindowProps> = ({ city, data, children, country }) => {
  const title = !city && (
    <h1 className="
        absolute -top-[10px] text-[#365a7a] text-[4rem] w-[800px]
        flex items-center justify-around
      ">
      <span
        aria-hidden
        className="block w-[250px] h-[250px] bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${titleIconUrl})` }}
      />
      Weather Forecast
    </h1>
  );

  const iconPath = useMemo( () => data ? `../../assets/svgs/${data.icon}.svg` : '../../assets/svgs/01d.svg', [data]);
  
  const iconSrc = useMemo( () => icons[iconPath] || icons['../../assets/svgs/01d.svg'], [iconPath]);

  const visibility = city ? 'visible' : 'hidden';
  const opacity = city ? 1 : 0;

  return (
    <div className="relative -top-[25px] h-full w-[980px] rounded-[30px] flex flex-col justify-center items-center bg-white/20 shadow-[0_0_10px_silver]">
      <div className="w-[800px] flex justify-center items-center relative">
        {title}
        <img
          src={iconSrc}
          key={iconSrc}
          alt="weather icon"
          className="relative left-[-80px] top-[90px] w-[300px] transition-[visibility] duration-[2000ms] ease-out"
          style={{ visibility, opacity }}
        />

        <div
          className="relative w-[350px] top-[90px] flex flex-col items-start justify-end"
          style={{ visibility, opacity }}
        >
          <span>Today</span>
          <h1 className="mb-[15px]">{country + ", " + city}</h1>
          <p className="relative pb-[5px] text-[#113555] transition-all duration-500 ease-out">

            Temperature: {data ? Math.round(data.temp - 273.15) : 0}°C
          </p>
          <p>{data ? data.weather_desc.toLowerCase() : ''}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default MainWeatherWindow;
