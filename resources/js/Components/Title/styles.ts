import styled from "styled-components";

interface IContainerProps {
    color?: string,
    bottomColor?: string,
    margin?: string,
    padding?: string,
    fontSize?: string,
    backgroundColor?: string,
    borderRadius?: string
}

export const Container = styled.h2<IContainerProps>`
    font-size: ${({ fontSize }) => fontSize || '24px'};
    margin: ${({ margin }) => margin || '0'};
    padding: ${({ padding }) => padding || '0'};
    color: ${({ color }) => color || '#fff'};
    background-color: ${({ backgroundColor }) => backgroundColor || 'unset'};
    border-radius: ${({ borderRadius }) => borderRadius || 'unset'};

    &:hover {
        cursor: pointer;
    }

    ${props => props.bottomColor &&
        `&::after {
            content: '';
            display: block;
            width: 3.4375rem;
            border-bottom: 8px solid ${props.bottomColor};
        }`
    }
`;
