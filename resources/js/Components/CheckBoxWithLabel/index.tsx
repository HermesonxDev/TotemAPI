import React from "react";
import { Container } from "./styles";

interface ICheckBoxWithLabelProps {
    label: string,
    width?: string,
    height?: string,
    checked: boolean,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckBoxWithLabel: React.FC<ICheckBoxWithLabelProps> = ({
    label,
    width,
    height,
    checked,
    value,
    onChange
}) => {
    return (
        <Container width={width} height={height}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                value={value}
            />
            <p>{label}</p>
        </Container>
    );
};

export default CheckBoxWithLabel;
