import React, { useState } from 'react';
import { Container, Label, Select } from './styles';

interface ISelectWithLabelProps {
  label: string,
  value?: string | number,
  required?: boolean,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  options: { value: string; label: string }[],
  width?: string,
  height?: string
}

const SelectWithLabel: React.FC<ISelectWithLabelProps> = ({
    label,
    value,
    required,
    onChange,
    options,
    width,
    height
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container width={width} height={height}>
      <Label isFocused={isFocused || value !== ''}>{label}</Label>
      <Select
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
      >
        <option value="" disabled hidden></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default SelectWithLabel;
