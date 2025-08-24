import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { SelectInputOption, SelectInputProps } from './types';

function defaultGetLabel<T extends SelectInputOption>(item: T): string {
  if (typeof item.name === 'string') return item.name;
  if (typeof item.label === 'string') return item.label;
  return String(item);
}

function defaultFilter<T extends SelectInputOption>(
  options: T[],
  query: string,
  getLabel: (t: T) => string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter((o) => getLabel(o).toLowerCase().includes(q));
}

export function SelectInput<T extends SelectInputOption>({
  options,
  getLabel = defaultGetLabel,
  onSelect,
  placeholder = 'Type to search…',
  className = '',
  defaultOpen = false,
  defaultValue = '',
  value,
  disabled = false,
  onChange,
  maxItems = 200,
  filterFn,
  onSubmitFreeText,
  tabSelects = false,
}: SelectInputProps<T>) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(defaultOpen);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = value !== undefined ? value : internalValue;

  const filtered = useMemo(() => {
    const base = (filterFn ?? defaultFilter)(options, query, getLabel);
    return base.slice(0, maxItems);
  }, [options, query, getLabel, filterFn, maxItems]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (filtered.length === 0) {
      setHighlightIndex(-1);
      return;
    }
    if (highlightIndex < 0 || highlightIndex >= filtered.length) {
      setHighlightIndex(0);
    }
  }, [open, filtered.length]);

  const setText = (val: string) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
  };

  const selectAt = async (idx: number) => {
    if (idx < 0 || idx >= filtered.length) return;
    const item = filtered[idx];
    const label = getLabel(item);
    setText(label);
    setOpen(false);
    setHighlightIndex(-1);
    await onSelect?.(item, label);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (!open && e.key === 'ArrowDown') {
      setOpen(true);
      setHighlightIndex(0);
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowDown' && filtered.length > 0) {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) => (prev + 1) % filtered.length);
      return;
    }

    if (e.key === 'ArrowUp' && filtered.length > 0) {
      e.preventDefault();
      setOpen(true);
      setHighlightIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
      return;
    }

    if (e.key === 'Tab' && open && filtered.length > 0) {
      e.preventDefault();
      if (tabSelects) {
        const idx = highlightIndex >= 0 ? highlightIndex : 0;
        await selectAt(idx);
      } else {
        if (e.shiftKey) {
          setHighlightIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
        } else {
          setHighlightIndex((prev) => (prev < 0 ? 0 : (prev + 1) % filtered.length));
        }
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filtered.length) {
        await selectAt(highlightIndex);
        return;
      }
      if (onSubmitFreeText && query.trim()) {
        await onSubmitFreeText(query.trim());
        setOpen(false);
        setHighlightIndex(-1);
      }
      return;
    }

    if (e.key === 'Escape') {
      setOpen(false);
      setHighlightIndex(-1);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setOpen(true);
    setHighlightIndex(-1);
  };

  const handleClear = () => {
    setText('');
    setOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };
  
  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${className}`}
      role="combobox"
      aria-expanded={open}
      aria-owns="selectinput-listbox"
      aria-haspopup="listbox"
    >
      <input
        ref={inputRef}
        disabled={disabled}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-[50px] py-[10px] leading-[120%] rounded-[20px] outline-none text-[20px] transition-all duration-300 bg-white shadow-[0_0_10px_silver] ${
          open && filtered.length > 0 ? 'rounded-b-none border-b-0' : ''
        }`}
        aria-autocomplete="list"
        aria-controls="selectinput-listbox"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-[15px] text-[15px] top-1/2 -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none"
          aria-label="Clear"
        >
          ✕
        </button>
      )}

      {open && filtered.length > 0 && (
        <ul
          id="selectinput-listbox"
          role="listbox"
          className="absolute z-10 mt-2 w-full top-[33px] bg-white rounded-b-[20px] max-h-60 overflow-y-auto shadow-[0_0_10px_silver] text-sm"
        >
          {filtered.map((item, index) => {
            const label = getLabel(item);
            const active = index === highlightIndex;
            return (
              <li
                key={`${label}-${index}`}
                role="option"
                aria-selected={active}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  active ? 'bg-gray-200' : ''
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectAt(index);
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
