export const getDayName = (dateString: string, locale = 'en-US'): string => {
  const d = new Date(dateString);
  return d.toLocaleDateString(locale, { weekday: 'long' });
};