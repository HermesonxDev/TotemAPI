import styled from "styled-components";
import Switch, { ReactSwitchProps } from 'react-switch';

export const Container = styled.div `
    display: flex;
    align-items: center;
`;

export const ToggleLabel = styled.span `
    color: #000;
`;

export const ToggleSelector = styled(Switch).attrs<ReactSwitchProps>(() => ({
    onColor: "#f7931b",
    offColor: "#e44c4e"
}))<ReactSwitchProps>`
    margin: ${({ margin }) => margin || '0 7px'};
`;
