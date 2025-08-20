import React from 'react';
import { SelectInput } from '../../shared-components/SelectInput';
import type { CityInputProps } from './types';
import { cityOptions } from './utils';

const isValidCity = (text: string) => /^[a-zA-ZäöüÄÖÜß\s-]+$/.test(text);

const CityInput: React.FC<CityInputProps> = ({ value, onChange, onSubmit, loading }) => {
  return (
    <div className="relative w-[600px] mx-auto">
      <SelectInput
        className={`duration-500 ease-out ${value ? 'top-[-380px]' : 'top-[-10px]'}`}
        options={cityOptions}
        getLabel={(o) => o.name}
        placeholder="Enter a City..."
        disabled={loading}
        onSelect={(_, label) => onChange(label)}
        onSubmitFreeText={(text) => {
          if (isValidCity(text)) {
            onChange(text);
            onSubmit?.();
          }
        }}
      />
    </div>
  );
};

export default CityInput;
