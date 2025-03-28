import styled from "styled-components";

interface IColProps {
    gridArea: string,
    backgroundColor?: string,
    margin?: string
}

export const Container = styled.div`
    display: grid;
    height: 100vh;
    min-width: 19.6875rem;

    /**
    * Grid:
    *     Tamanho de 1x3
    *     Colunas: 23% 23% 54%
    *     Linhas: 100%
    *
    * Componentes:
    *     Col1
    *     Col2
    *     Col3
    *
    * Preview:
    *           |              |
    *           |              |
    *           |              |
    *           |              |
    *    Col1   |     Col2     |     Col3
    *           |              |
    *           |              |
    *           |              |
    *           |              |
    */
    grid-template-columns: 33.3% 33.3% 33.3%;
    grid-template-rows: 100%;
    grid-template-areas: "col1 col2 col3";
`;

export const Col = styled.div<IColProps>`
    grid-area: ${props => props.gridArea};
    background-color: ${({ backgroundColor }) => backgroundColor || '#F3F4F6'};
    margin: ${({ margin }) => margin || '0'};
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 0.25rem;
    padding: 0.25rem;
    -webkit-box-shadow: 0.5px 1.5px 3px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0.5px 1.5px 3px 0px rgba(0,0,0,0.75);
    box-shadow: 0.5px 1.5px 3px 0px rgba(0,0,0,0.75);
`;
