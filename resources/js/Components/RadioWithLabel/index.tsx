import React from "react";
import { Container } from "./styles";

interface IRadioWithLabelProps {
    label?: string,
    width?: string,
    height?: string,
    name: string,
    checked?: boolean,
    required?: boolean,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioWithLabel: React.FC<IRadioWithLabelProps> = ({
    label,
    width,
    height,
    name,
    checked,
    required,
    value,
    onChange
}) => {
    return (
        <Container width={width} height={height}>
            <input
                type="radio"
                name={name}
                id={value}
                checked={checked}
                required={required}
                value={value}
                onChange={onChange}
            />
            {label && <p>{label}</p>}
        </Container>
    );
};

export default RadioWithLabel;
