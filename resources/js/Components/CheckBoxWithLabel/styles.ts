import styled from "styled-components";

interface IContainerProps {
    width?: string
    height?: string,
}

export const Container = styled.div<IContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: auto 0;
    gap: 5px;
    width: ${({ width }) => width || '100%'};
    height: ${({ height }) => height || '100%'};
    flex-grow: 1;

    > p {
        color: #666;
        margin-top: 0.125rem;
    }
`;
