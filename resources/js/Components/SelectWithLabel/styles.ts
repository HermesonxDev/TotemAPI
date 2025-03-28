import styled from 'styled-components';

interface ContainerProps {
    width?: string,
    height?: string
}

interface LabelProps {
    isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
    position: relative;
    margin: 10px 0;
    width: ${({ width }) => width || '100%'};
    ${props => props.height &&
        `height: ${props.height};`
    }
    flex-grow: 1;
`;

export const Label = styled.label<LabelProps>`
    position: absolute;
    top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '50%')};
    left: 12px;
    font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '1rem')};
    color: #666;
    background-color: #fff;
    padding: 0 4px;
    transform: translateY(-50%);
    transition: 0.2s ease all;
    pointer-events: none;

    // MONITOR (1920x1080)
    @media(max-width: 1920px) and (max-height: 1080px) {
      top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '45%')};
    }

    // MONITOR (1440x900)
    @media(max-width: 1440px) and (max-height: 900px) {
        left: 5px;
        top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '55%')};
        font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '0.9rem')};
    }

    // MONITOR (1366x768)
    @media(max-width: 1366px) and (max-height: 768px) {
        left: 5px;
        top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '70%')};
        font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '0.8rem')};
    }

    // MONITOR (1280x1024)
    @media(max-width: 1280px) and (max-height: 1024px) {
      top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '45%')};
      font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '0.9rem')};
    }
`;

export const Select = styled.select`
    width: 100%;
    padding: 16px 12px 8px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    background-color: #fff;
    appearance: none;

    &:focus {
      outline: none;
      border-color: #000;
    }

    option {
      font-size: 16px;
    }
`;
