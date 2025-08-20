export type SelectInputOption = Record<string, unknown>;

export type SelectInputProps<T extends SelectInputOption> = {
  options: T[];
  getLabel?: (item: T) => string;
  onSelect?: (item: T, label: string) => void | Promise<void>;
  placeholder?: string;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  maxItems?: number;
  filterFn?: (options: T[], query: string, getLabel: (t: T) => string) => T[];
  onSubmitFreeText?: (text: string) => void | Promise<void>;
  tabSelects?: boolean;
  disabled?: boolean;
};