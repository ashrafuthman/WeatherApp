import type { WeatherDay } from "../../types";

export type MainWeatherWindowProps = {
  city?: string;
  country?: string;
  data?: WeatherDay;
  children?: React.ReactNode;
};