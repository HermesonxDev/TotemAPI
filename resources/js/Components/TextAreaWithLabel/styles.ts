import styled from "styled-components";

export const Container = styled.div<{ width?: string; height?: string }>`
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 12px 0;
    width: ${({ width }) => width || "100%"};
    height: ${({ height }) => height || "auto"};
`;

export const Label = styled.label<{ isFocused: boolean }>`
    position: absolute;
    top: ${({ isFocused }) => (isFocused ? '-1.1rem' : '40%')};
    left: 10px;
    font-size: ${({ isFocused }) => (isFocused ? "12px" : "16px")};
    color: #777;
    transition: all 0.2s ease;
    pointer-events: none;
`;

export const TextArea = styled.textarea<{ padding?: string }>`
    width: 100%;
    height: 100%;
    padding: ${({ padding }) => padding || "10px"};
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    resize: none;
    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;
