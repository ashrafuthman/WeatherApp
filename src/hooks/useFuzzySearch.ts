import Fuse from 'fuse.js';
import { useMemo } from 'react';

export const useFuzzySearch = <T extends object>(
  list: T[],
  keys: string[],
  query: string
): T[] => {
  const fuse = useMemo(() => {
    return new Fuse(list, {
      keys,
      threshold: 0.3,
    });
  }, [list, keys]);

  if (!query) return list.slice(0, 10);

  return fuse.search(query).slice(0, 10).map(result => result.item);
};