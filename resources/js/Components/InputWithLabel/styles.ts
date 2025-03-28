import styled from "styled-components";

interface IContainerProps {
    margin?: string,
    width?: string
    height?: string
}

interface ILabelProps {
    isFocused: boolean,
    backgroundColor?: string
}

interface IInputProps {
    padding?: string
}

interface IHiddenFileInputProps {
    imageDisplay?: string
}

export const Container = styled.div<IContainerProps>`
    position: relative;
    margin: ${({ margin }) => margin || '12px 0'};
    width: ${({ width }) => width || '100%'};
    ${props => props.height &&
        `height: ${props.height};`
    }
    flex-grow: 1;
    align-items: center;
`;

export const Label = styled.label<ILabelProps>`
    position: absolute;
    top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '50%')};
    left: 12px;
    font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '0.9375rem')};
    color: #666;
    background-color: ${({ backgroundColor }) => backgroundColor || "#fff"};
    transform: translateY(-50%);
    transition: 0.2s ease all;
    pointer-events: none;

    // MEDIA QUERY MONITOR (1920x1080)
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
        top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '70%')};
        font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '0.8rem')};
    }

    // MONITOR (1280x1024)
    @media(max-width: 1280px) and (max-height: 1024px) {
      top: ${({ isFocused }) => (isFocused ? '-0.625rem' : '45%')};
      font-size: ${({ isFocused }) => (isFocused ? '0.75rem' : '0.9rem')};
    }
`;

export const Input = styled.input<IInputProps>`
    width: 100%;
    font-size: 16px;
    border: 1px solid #ccc;
    padding: ${({ padding }) => padding || '3px 12px'};
    border-radius: 0.25rem;

    &:focus {
      outline: none;
      border-color: #bfbfbf;
    }
`;

export const FileButtonWrapper = styled.div`
    display: flex;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    align-items: center;
    width: 100%;
    height: 100%;
`;

export const HiddenFileInput = styled.input<IHiddenFileInputProps>`
    display: ${({ imageDisplay }) => imageDisplay || 'none'};
`;

export const StyledButton = styled.button`
    background-color: #1A73E8;
    color: #fff;
    font-size: 12px;
    height: 100%;
    width: 100%;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #1558b8;
    }

    // MONITOR (1920x1080)
    @media(max-width: 1920px) and (max-height: 1080px) {
      padding: 12px 16px;
      margin-left: 81%;
    }

    // MONITOR (1440x900)
    @media(max-width: 1440px) and (max-height: 900px) {
      padding: 8px 16px;
      margin-left: 78%;
    }

    // MONITOR (1366x768)
    @media(max-width: 1366px) and (max-height: 768px) {
      padding: 4px 10px;
      margin-left: 79%;
    }

    // MONITOR (1280x1024)
    @media(max-width: 1280px) and (max-height: 1024px) {
      padding: 0.625rem;
      margin-left: 77%;
    }
`;
