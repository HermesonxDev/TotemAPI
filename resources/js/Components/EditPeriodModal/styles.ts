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

interface IPeriodRowProps {
    gridArea: string
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

export const Body = styled.form`
    display: flex;
    flex-direction: row;
    border: 1px solid gray;
    margin: 0.75rem;
    height: 100%;
    border-radius: 0.25rem;
`;

export const Menu = styled.div`
    width: 27%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
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

export const Period = styled.div`
    width: 73%;
    height: 100%;
    display: grid;
    background-color: white;
    padding: 0.75rem;

    /**
    * Grid:
    *     Tamanho de 1x4
    *     Colunas: 100%
    *     Linhas: 6% 29.66% 29.66% 29.66% 5%
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
    grid-template-rows: 8% 8% 84%;
    grid-template-areas: "row1" "row2" "row3";
`;

export const PeriodRow = styled.div<IPeriodRowProps>`
    grid-area: ${props => props.gridArea};
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const PeriodRow3 = styled.div`
    grid-area: row3;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;