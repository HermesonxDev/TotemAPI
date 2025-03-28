import { useEffect, useState } from "react"
import Modal from "../Modal"
import ObjectId from 'bson-objectid';

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
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr]">
                            <div className="contents font-bold">
                                <div className="p-[10px] flex justify-center">Código PDV</div>
                                <div className="p-[10px] flex justify-center">Produto</div>
                                <div className="p-[10px] flex justify-center">Quantidade</div>
                                <div className="p-[10px] flex justify-center">Preço</div>
                                <div className="p-[10px] flex justify-center">Total</div>
                            </div>

                            {detailedOrder?.items.map(item => (
                                <div className="contents overflow-x-scroll">
                                    <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400 items-center">
                                        {item.code}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400 items-center">
                                        {item.title}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400 items-center">
                                        {item.quantity}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400 items-center">
                                        {formatMoney(item.price)}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400 items-center">
                                        {formatMoney(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
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
