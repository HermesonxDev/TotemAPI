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

interface IImagesRowProps {
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
    width: 100%;
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
    grid-template-rows: 6% 8% 8% 8% 9% 8% 8% 45%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6" "row7" "row8";
`;

export const GeneralRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    margin-top: 9px;
`;

export const GeneralRow6 = styled.div`
    grid-area: row6;
`;

export const GeneralRow7 = styled.div`
    grid-area: row7;
`;

export const GeneralRow8 = styled.div`
    grid-area: row8;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const Photo = styled.div`
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
    grid-template-rows: 2.5% 93.5% 4%;
    grid-template-areas: "row1" "row2" "row3";
`;

export const PhotoRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const PhotoRow2 = styled.div`
    grid-area: row2;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
`;

export const PhotoRow3 = styled.div`
    grid-area: row3;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
    gap: 10px;
`;

export const AditionalInformation = styled.div`
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
    grid-template-rows: 6% 8% 8% 8% 8% 8% 8% 8% 38%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6" "row7" "row8" "row9";
`;

export const AditionalInformationRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const AditionalInformationRow2 = styled.div`
    grid-area: row2;
`;

export const AditionalInformationRow3 = styled.div`
    grid-area: row3;
`;

export const AditionalInformationRow4 = styled.div`
    grid-area: row4;

`;

export const AditionalInformationRow5 = styled.div`
    grid-area: row5;
`;

export const AditionalInformationRow6 = styled.div`
    grid-area: row6;
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const AditionalInformationRow7 = styled.div`
    grid-area: row7;
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const AditionalInformationRow8 = styled.div`
    grid-area: row8;
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const AditionalInformationRow9 = styled.div`
    grid-area: row9;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const ProductImage = styled.img`
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
`;
