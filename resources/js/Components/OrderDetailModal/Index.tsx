import Modal from "../Modal"

import {
    Container,
    Header,
    General,
    Button,
    Title,
    GeneralRow1,
    GeneralRow2,
    GeneralRow3,
    GeneralRow4,
    GeneralRow5,
} from "./styles"

import { Order } from "@/utils/interfaces"
import handleLocationType from "@/utils/handleLocationType";
import formatMoney from "@/utils/formatMoney";
import GridContainer from "../GridContainer";
import GridHeaderRow from "../GridHeaderRow";
import GridHeaderItem from "../GridHeaderItem";
import GridBodyRow from "../GridBodyRow";
import GridBodyItem from "../GridBodyItem";

interface IOrderDetailModalProps {
    show: boolean,
    detailedOrder: Order | null,
    onClose(): void
}

const OrderDetailModal: React.FC<IOrderDetailModalProps> = ({
    show,
    detailedOrder,
    onClose
}) => {

    return (
        <Modal show={show} onClose={onClose}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Detalhes do Pedido</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={onClose}
                    >Sair</Button>
                </Header>

                <General>
                    <GeneralRow1>
                        <Title>Pedido #{detailedOrder?.seq} - {handleLocationType(detailedOrder?.locationType)}</Title>
                        <p>Forma de Pagamento: {detailedOrder?.paymentMethod.label}</p>
                    </GeneralRow1>

                    <GeneralRow2>
                        <p>Nome: {detailedOrder?.totemClientName || "N/A"}</p>
                        <p>CPF: {detailedOrder?.cpfCustomer || "N/A"}</p>
                        <p>Email: {detailedOrder?.totemNF_email || "N/A"}</p>
                        <p>Origem: {detailedOrder?.originOrder || "N/A"}</p>
                    </GeneralRow2>

                    <GeneralRow3>
                        <GridContainer gap="4">

                            <GridHeaderRow
                                gridCols="grid-cols-[1fr_2.5fr_1fr_1fr_1fr]"
                                background="gray-800"
                            >
                                <GridHeaderItem padding="p-2">Cód PDV</GridHeaderItem>
                                <GridHeaderItem padding="p-2">Produto</GridHeaderItem>
                                <GridHeaderItem padding="p-2">Quantidade</GridHeaderItem>
                                <GridHeaderItem padding="p-2">Preço</GridHeaderItem>
                                <GridHeaderItem padding="p-2">Total</GridHeaderItem>
                            </GridHeaderRow>

                            {detailedOrder?.items.map((item, index) => (
                                <div key={index} className="flex flex-col bg-white shadow rounded-md border border-gray-300 overflow-hidden">

                                    <GridBodyRow
                                        gridCols="grid-cols-[1fr_2.5fr_1fr_1fr_1fr]"
                                        background="gray-100"
                                    >
                                        <GridBodyItem padding="p-3">{item.code}</GridBodyItem>
                                        <GridBodyItem padding="p-3" className="text-center break-words leading-tight">
                                            {item.title || item.name}
                                        </GridBodyItem>
                                        <GridBodyItem padding="p-3">{item.quantity}</GridBodyItem>
                                        <GridBodyItem padding="p-3">{formatMoney(item.price)}</GridBodyItem>
                                        <GridBodyItem padding="p-3">{formatMoney(item.price * item.quantity)}</GridBodyItem>
                                    </GridBodyRow>

                                    {item.complements?.length > 0 && (
                                        <>
                                            <GridBodyRow
                                                gridCols="grid-cols-[1fr_2.5fr_1fr_1fr_1fr]"
                                                background="gray-200"
                                            >
                                                <GridBodyItem padding="p-2">Cód PDV</GridBodyItem>
                                                <GridBodyItem padding="p-2">Complemento</GridBodyItem>
                                                <GridBodyItem padding="p-2">Quantidade</GridBodyItem>
                                                <GridBodyItem padding="p-2">Preço</GridBodyItem>
                                                <GridBodyItem padding="p-2">Total</GridBodyItem>
                                            </GridBodyRow>

                                            {item.complements.map((complement, index) => (
                                                <div key={index} className="grid grid-cols-[1fr_2.5fr_1fr_1fr_1fr] bg-white text-sm border-t border-gray-200">
                                                    <GridBodyItem padding="p-3">{complement.code}</GridBodyItem>
                                                    <GridBodyItem padding="p-3" className="text-center break-words leading-tight">
                                                        {complement.title || complement.name}
                                                    </GridBodyItem>
                                                    <GridBodyItem padding="p-3">{complement.quantity}</GridBodyItem>
                                                    <GridBodyItem padding="p-3">{formatMoney(complement.price)}</GridBodyItem>
                                                    <GridBodyItem padding="p-3">{formatMoney(complement.price * complement.quantity)}</GridBodyItem>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ))}
                        </GridContainer>
                    </GeneralRow3>

                    <GeneralRow4>
                        <div className="flex flex-col gap-1">
                            <p>Informações Adicionais</p>
                            <p>Subtotal</p>
                            <p>Total</p>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                            <p>{detailedOrder?.additionalInfo}</p>
                            <p>{formatMoney(detailedOrder?.subtotal)}</p>
                            <p>{formatMoney(detailedOrder?.total)}</p>
                        </div>
                    </GeneralRow4>

                    <GeneralRow5>
                        <div className="absolute bottom-0 right-0">
                            <Button type="button">Fechar</Button>
                        </div>
                    </GeneralRow5>
                </General>
            </Container>
        </Modal>
    )
}

export default OrderDetailModal
