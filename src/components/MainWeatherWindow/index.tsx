import React, { useMemo } from 'react';
import titleIconUrl from '../../assets/svgs/02d.svg';
import type { MainWeatherWindowProps } from './types';

const icons = import.meta.glob('../../assets/svgs/*.svg', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

const MainWeatherWindow: React.FC<MainWeatherWindowProps> = ({ city, data, children, country }) => {
  const title = !city && (
    <div className="
          w-full
          flex justify-center gap-4 items-center
        ">
      <div>
        <img src={titleIconUrl} alt="Weather Forecast" className="block w-[250px] h-[250px] bg-no-repeat bg-contain" />
      </div>
      <div>
        <h1 className="
           text-[3rem]
        ">
          Weather Forecast
        </h1>
      </div>
    </div>
  );

  const iconPath = useMemo( () => data ? `../../assets/svgs/${data.icon}.svg` : '../../assets/svgs/01d.svg', [data]);
  
  const iconSrc = useMemo( () => icons[iconPath] || icons['../../assets/svgs/01d.svg'], [iconPath]);

  const visibility = city ? 'visible' : 'hidden';
  const opacity = city ? 1 : 0;

  return (
    <div className="relative w-[70wvh] rounded-[30px] flex flex-col items-center justify-center bg-white/20 shadow-[0_0_10px_silver]">
      <div
       className={title ? "w-full h-[250px]" : "w-full md:h-[150px] flex flex-wrap items-center md:pl-10 pb-10 md:gap-4"}>
        {title}
        <img
          src={iconSrc}
          key={iconSrc}
          alt="weather icon"
          className="w-[250px] transition-[visibility] duration-[2000ms] ease-out"
          style={{ visibility, opacity }}
        />

        <div
          className="flex flex-col items-start justify-end md:text-[25px] font-bold"
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
