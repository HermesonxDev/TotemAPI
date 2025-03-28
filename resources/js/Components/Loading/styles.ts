import styled, { keyframes } from "styled-components";
import { AiOutlineLoading } from "react-icons/ai";

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
`;

interface IContainerProps {
    marginTop?: string
}

interface ILoadingIconProps {
    width?: string,
    height?: string
}

export const Container = styled.div<IContainerProps> `
    margin-top: ${({ marginTop }) => marginTop || '100px'};
    display: flex;
    justify-content: center;
    z-index: 9999;
`;

export const LoadingIcon = styled(AiOutlineLoading)<ILoadingIconProps>`
    width: ${({ width }) => width || 'unset'};
    height: ${({ height }) => height || 'unset'};
    animation: ${rotate} 2s linear infinite;
    font-size: 5rem;
    color: #bcbcbc;
`;
