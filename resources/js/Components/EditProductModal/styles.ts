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

interface IImageRowProps {
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

export const General = styled.div`
    width: 73%;
    height: 100%;
    display: grid;
    background-color: white;
    padding: 0.75rem;

    /**
    * Grid:
    *     Tamanho de 1x8
    *     Colunas: 100%
    *     Linhas: 7% 8% 12% 7% 7% 7% 7% 7%
    *
    * Componentes:
    *     Row1
    *     Row2
    *     Row3
    *     Row4
    *     Row5
    *     Row6
    *     Row7
    *     Row8
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
    *            row6
    *-----------------------------
    *            row7
    *-----------------------------
    *            row8
    *-----------------------------
    *            row9
    *-----------------------------
    */
    grid-template-columns: 100%;
    grid-template-rows: 7% 8% 12% 7% 7% 7% 7% 7% 38%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6" "row7" "row8" "row9";
`;

export const GeneralRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const GeneralRow2 = styled.div`
    grid-area: row2;
`;

export const GeneralRow3 = styled.div`
    grid-area: row3;
`;

export const GeneralRow4 = styled.div`
    grid-area: row4;
`;

export const GeneralRow5 = styled.div`
    grid-area: row5;
`;

export const GeneralRow6 = styled.div`
    grid-area: row6;
`;

export const GeneralRow7 = styled.div`
    grid-area: row7;
`;

export const GeneralRow8 = styled.div`
    grid-area: row8;
`;

export const GeneralRow9 = styled.div`
    grid-area: row9;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const Image = styled.div`
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
    grid-template-rows: 6% 29.66% 29.66% 29.66% 5%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6";
`;

export const ImageRow1 = styled.div`
    grid-area: row1;
`;

export const ImageRow = styled.div<IImageRowProps>`
    grid-area: ${props => props.gridArea};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
`;

export const ImageRow5 = styled.div`
    grid-area: row5;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 5px;
    margin-top: 7px;
`;

export const ProductImage = styled.img`
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
`;

export const Availability = styled.div`
    width: 73%;
    height: 100%;
    display: grid;
    background-color: white;
    padding: 0.75rem;

    /**
    * Grid:
    *     Tamanho de 1x3
    *     Colunas: 100%
    *     Linhas: 3% 5% 92%
    *
    * Componentes:
    *     Row1
    *     Row2
    *     Row3
    *
    * Preview:
    *
    *            row1
    *-----------------------------
    *            row2
    *-----------------------------
    *            row3
    *-----------------------------
    */
    grid-template-columns: 100%;
    grid-template-rows: 3% 5% 92%;
    grid-template-areas: "row1" "row2" "row3";
`;

export const AvailabilityRow1 = styled.div`
    grid-area: row1;
`;

export const AvailabilityRow2 = styled.div`
    grid-area: row2;
    display: flex;
    flex-direction: row;
`;

export const AvailabilityRow3 = styled.div`
    grid-area: row3;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const Complements = styled.div`
    width: 73%;
    height: 100%;
    display: grid;
    background-color: white;
    padding: 0.75rem;

    /**
    * Grid:
    *     Tamanho de 1x3
    *     Colunas: 100%
    *     Linhas: 3% 5% 92%
    *
    * Componentes:
    *     Row1
    *     Row2
    *     Row3
    *
    * Preview:
    *
    *            row1
    *-----------------------------
    *            row2
    *-----------------------------
    *            row3
    *-----------------------------
    */
    grid-template-columns: 100%;
    grid-template-rows: 3% 90% 7%;
    grid-template-areas: "row1" "row2" "row3";
`;

export const ComplementsRow1 = styled.div`
    grid-area: row1;
`;

export const ComplementsRow2 = styled.div`
    grid-area: row2;
    display: flex;
    flex-direction: column;
`;

export const ComplementsRow3 = styled.div`
    grid-area: row3;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;
