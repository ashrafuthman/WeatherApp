export type CityOption = {
  name: string;
  country: string;
  label: string;
  lat: number;
  lon: number;
  population: number;
};

export type WeatherDay = {
  date: string;
  weather_desc: string;
  icon: string;
  temp: number;
};

export type WeatherData = {
  cod: string;
  city: {
    country: string;
    name: string;
  };
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
 }[];
 };