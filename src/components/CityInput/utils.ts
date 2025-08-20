import cities from 'cities-list';

export const cityOptions = Object.keys(cities).map(city => ({
  name: city,
}));