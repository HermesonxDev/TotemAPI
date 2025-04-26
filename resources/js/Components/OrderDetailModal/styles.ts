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
    display: flex;
    flex-direction: column;
    height: 850px;
`;

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid gray;
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

export const General = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    background-color: white;
    padding: 0.75rem;

    /**
    * Grid:
    *     Tamanho de 1x5
    *     Colunas: 100%
    *     Linhas: 7% 8% 12% 7% 7% 7% 7%
    *
    * Componentes:
    *     Row1
    *     Row2
    *     Row3
    *     Row4
    *     Row5
    *
    * Preview:
    *
    *            row1
    *-----------------------------
    *            row2
    *-----------------------------
    *            row3
    *-----------------------------
    *            row4
    *-----------------------------
    *            row5
    *-----------------------------
    */
    grid-template-columns: 100%;
    grid-template-rows: 8% 15% 56% 15% 6%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5";
`;

export const GeneralRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.25rem;
    border: 3px solid #F3F4F6;
`;

export const GeneralRow2 = styled.div`
    grid-area: row2;
    display: flex;
    flex-direction: column;
    border-radius: 0.25rem;
    border: 3px solid #F3F4F6;
    padding: 0.5rem;
`;

export const GeneralRow3 = styled.div`
    grid-area: row3;
    overflow: scroll;
    margin-top: 10px;
    border-radius: 0.25rem;
    border: 3px solid #F3F4F6;
    padding: 0.5rem;
`;

export const GeneralRow4 = styled.div`
    grid-area: row4;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
    border-radius: 0.25rem;
    border: 3px solid #F3F4F6;
    padding: 0.5rem;
`;

export const GeneralRow5 = styled.div`
    grid-area: row5;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;
