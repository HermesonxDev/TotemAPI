import styled from "styled-components";

interface IButtonProps {
    padding?: string,
    height?: string,
    margin?: string,
    backgroundColor?: string,
    color?: string
}

interface ITitleProps {
    margin?: string
}


export const Container = styled.div`
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
`;

export const Button = styled.button<IButtonProps>`
    border-radius: 0.25rem;
    background-color: ${({ backgroundColor }) => backgroundColor || 'black'};
    color: ${({ color }) => color || 'white'};
    padding: ${({ padding }) => padding || '3px 10px'};
    height: ${({ height }) => height || 'unset'};
    margin: ${({ margin }) => margin || 'unset'};
`;

export const Title = styled.h2<ITitleProps>`
    margin: ${({ margin }) => margin || 'unset'};
`;
