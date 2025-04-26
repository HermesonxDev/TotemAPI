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
    grid-template-rows: 6% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8% 14%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6" "row7" "row8" "row9" "row10" "row11" "row12";
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
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const GeneralRow5 = styled.div`
    grid-area: row5;
`;

export const GeneralRow6 = styled.div`
    grid-area: row6;
    display: flex;
    align-items: center;
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
    gap: 5px;
`;

export const GeneralRow10 = styled.div`
    grid-area: row10;
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const GeneralRow11 = styled.div`
    grid-area: row11;
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export const GeneralRow12 = styled.div`
    grid-area: row12;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const TotemConfig = styled.div`
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
    grid-template-rows: 8% 8% 8% 8% 8% 45% 15%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6" "row7";
`;

export const TotemConfigRow1 = styled.div`
    grid-area: row1;
`;

export const TotemConfigRow2 = styled.div`
    grid-area: row2;
`;

export const TotemConfigRow3 = styled.div`
    grid-area: row3;
`;

export const TotemConfigRow4 = styled.div`
    grid-area: row4;
`;

export const TotemConfigRow5 = styled.div`
    grid-area: row5;
`;

export const TotemConfigRow6 = styled.div`
    grid-area: row6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const TotemConfigRow7 = styled.div`
    grid-area: row7;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const AppConfig = styled.div`
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
    grid-template-rows: 6% 8% 8% 78%;
    grid-template-areas: "row1" "row2" "row3" "row4";
`;

export const AppConfigRow1 = styled.div`
    grid-area: row1;
`;

export const AppConfigRow2 = styled.div`
    grid-area: row2;
`;

export const AppConfigRow3 = styled.div`
    grid-area: row3;
`;

export const AppConfigRow4 = styled.div`
    grid-area: row4;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const ProductImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
`;

export const Images = styled.div`
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
    grid-template-rows: 2.5% 18.5% 18.5% 18.5% 18.5% 18.5% 5%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6" "row7";
`;

export const ImagesRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const ImagesRow = styled.div<IImagesRowProps>`
    grid-area: ${props => props.gridArea};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 5px;
`;

export const ImagesRow7 = styled.div`
    grid-area: row7;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 7px;
`;

export const Printing = styled.div`
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
    grid-template-rows: 13% 9% 8% 70%;
    grid-template-areas: "row1" "row2" "row3" "row4";
`;

export const PrintingRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const PrintingRow2 = styled.div`
    grid-area: row2;
    margin-top: 12px;
`;

export const PrintingRow3 = styled.div`
    grid-area: row3;
`;

export const PrintingRow4 = styled.div`
    grid-area: row4;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const Orders = styled.div`
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
    grid-template-rows: 8% 8% 4% 14% 14% 52%;
    grid-template-areas: "row1" "row2" "row3" "row4" "row5" "row6";
`;

export const OrdersRow1 = styled.div`
    grid-area: row1;
`;

export const OrdersRow2 = styled.div`
    grid-area: row2;
    display: flex;
    flex-direction: column;
`;

export const OrdersRow3 = styled.div`
    grid-area: row3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const OrdersRow4 = styled.div`
    grid-area: row4;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const OrdersRow5 = styled.div`
    grid-area: row5;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const OrdersRow6 = styled.div`
    grid-area: row6;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;

export const Payment = styled.div`
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
    grid-template-rows: 13% 8% 8% 71%;
    grid-template-areas: "row1" "row2" "row3" "row4";
`;

export const PaymentRow1 = styled.div`
    grid-area: row1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const PaymentRow2 = styled.div`
    grid-area: row2;
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin-top: 12px;
`;

export const PaymentRow3 = styled.div`
    grid-area: row3;
    display: flex;
    align-items: center;
`;

export const PaymentRow4 = styled.div`
    grid-area: row4;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    position: relative;
`;
