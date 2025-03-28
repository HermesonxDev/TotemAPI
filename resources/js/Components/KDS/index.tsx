import { Container, Col  } from "./styles"
import Title from "../Title"
import OrderBox from "../OrderBox"
import { Order } from "@/utils/interfaces"
import { useEffect, useState } from "react"
import OrderDetailModal from "../OrderDetailModal/Index"
import ListOrderBox from "../ListOrderBox"

interface IKDSProps {
    orders: Order[]
}

const KDS: React.FC<IKDSProps> = ({ orders }) => {

    const [pendingOrders, setPendingOrders] = useState<Order[]>([])
    const [approvedOrders, setApprovedOrders] = useState<Order[]>([])
    const [finishedOrders, setFinishedOrders] = useState<Order[]>([])
    const [detailedOrder, setDetailedOrder] = useState<Order | null>(null)
    const [openOrderDetailModal, setOpenOrderDetailModal] = useState<boolean>(false)

    const openDetailedOrder = (order: Order) => {
        setDetailedOrder(order)
        setOpenOrderDetailModal(true)
    }

    useEffect(() => {
        setPendingOrders(prev => {
            const uniqueOrders = new Set(prev.map(o => o.id));
            return [...prev, ...orders.filter(order => order.status === 1 && !uniqueOrders.has(order.id))];
        });

        setApprovedOrders(prev => {
            const uniqueOrders = new Set(prev.map(o => o.id));
            return [...prev, ...orders.filter(order => order.status === 2 && !uniqueOrders.has(order.id))];
        });

        setFinishedOrders(prev => {
            const uniqueOrders = new Set(prev.map(o => o.id));
            return [...prev, ...orders.filter(order => order.status === 512 && !uniqueOrders.has(order.id))];
        });
    }, [orders]);

    return (
        <Container>
            <Col gridArea="col1" margin="0 15px 0 0">
                <Title
                    margin="15px auto 0 auto"
                    backgroundColor="black"
                    padding="0 30px"
                    borderRadius="0.25rem"
                >Pendente</Title>

                <ListOrderBox>
                    {pendingOrders.map(order => (
                        <OrderBox
                            key={order.id}
                            data={order}
                            onClick={() => openDetailedOrder(order)}
                        />
                    ))}
                </ListOrderBox>
            </Col>

            <Col gridArea="col2">
                <Title
                    margin="15px auto 0 auto"
                    backgroundColor="black"
                    padding="0 30px"
                    borderRadius="0.25rem"
                >Aprovado</Title>

                <ListOrderBox>
                    {approvedOrders.map(order => (
                        <OrderBox
                            key={order.id}
                            data={order}
                            onClick={() => openDetailedOrder(order)}
                        />
                    ))}
                </ListOrderBox>
            </Col>

            <Col gridArea="col3" margin="0 0 0 15px">
                <Title
                    margin="15px auto 0 auto"
                    backgroundColor="black"
                    padding="0 30px"
                    borderRadius="0.25rem"
                >Finalizado</Title>

                <ListOrderBox>
                    {finishedOrders.map(order => (
                        <OrderBox
                            key={order.id}
                            data={order}
                            onClick={() => openDetailedOrder(order)}
                        />
                    ))}
                </ListOrderBox>
            </Col>

            {openOrderDetailModal &&
                <OrderDetailModal
                    show={openOrderDetailModal}
                    detailedOrder={detailedOrder}
                    onClose={() => setOpenOrderDetailModal(false)}
                />
            }
        </Container>
    )
}

export default KDS
