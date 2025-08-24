import { SNAPSHOT_HOUR_24 } from "./constants";
import type { WeatherData } from "./types";

export const getDayIndices = (data: WeatherData, targetHour = SNAPSHOT_HOUR_24): number[] => {
  if (!data.list.length) return [];
  const indices: number[] = [0];
  let i = 0;
  let currentDay = getDayFromDtTxt(data.list[0].dt_txt);

  while (indices.length < 5 && i < data.list.length - 1) {
    i++;
    const row = data.list[i];
    if (!row) break;
    const day = getDayFromDtTxt(row.dt_txt);
    const hour = getHourFromDtTxt(row.dt_txt);

    if (day !== currentDay && hour === targetHour) {
      indices.push(i);
      currentDay = day!;
    }
  }
  return indices;
};

export const getDayName = (dateString: string, locale = 'en-US'): string => {
  const d = new Date(dateString);
  return d.toLocaleDateString(locale, { weekday: 'long' });
};

export const getDayFromDtTxt = (dt_txt: string) => dt_txt.slice(8, 10);
export const getHourFromDtTxt = (dt_txt: string) => dt_txt.slice(11, 13);
export const kelvinToC = (k: number) => Math.round(k - 273.15);
