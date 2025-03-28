import { useState } from "react"
import Modal from "../Modal"

import {
    Container,
    Button,
    Title
} from "./styles"

import api from "@/Services/api";
import Loading from "../Loading";
import { Category, Complement, Product } from "@/utils/interfaces";

interface IDeleteModalProps {
    deletedProductOrCategoryOrComplementGroup: Product | Complement | Category | null,
    show: boolean,
    url: string,
    onClose(): void
}

const DeleteModal: React.FC<IDeleteModalProps> = ({
    deletedProductOrCategoryOrComplementGroup,
    show,
    url,
    onClose
}) => {

    const [loading, setLoading] = useState<boolean>(false);

    const getItemName = (item: Product | Complement | Category | null) => {
        if (!item) return "Desconhecido";
    
        if ("name" in item) return item.name;
        if ("title" in item) return item.title;
    
        return "Desconhecido";
    };

    const getdeletedProductOrCategoryOrComplementGroupType = (item: Product | Complement | Category | null) => {
        if (!item) return "Desconhecido";
    
        if ("category" in item) return "o Produto"
        if ("items" in item) return "o Grupo de Complementos"
        if ("ingredients" in item) return "a Categoria"
    
        return "Desconhecido";
    };    

    const deleteItem = async (id: string | undefined) => {
        try {
            setLoading(true)

            const data = { id: id }
            await api.post(url, data)

            window.location.reload()
        } catch (err: unknown) {
            setLoading(false)
            console.error(err)
        }
    }

    return (
        <Modal show={show} onClose={onClose}>
            <Container>
                <h2 className="mx-auto text-lg">
                    Tem certeza que deseja <strong>DELETAR</strong> {getdeletedProductOrCategoryOrComplementGroupType(deletedProductOrCategoryOrComplementGroup)} <strong>[{getItemName(deletedProductOrCategoryOrComplementGroup)}]</strong> ?
                </h2>

                <div className="flex justify-end gap-1">
                    {!loading
                        ?
                            <>
                                <Button type="button" onClick={onClose}>Cancelar</Button>
                                <Button type="button" onClick={() => deleteItem(deletedProductOrCategoryOrComplementGroup?._id)}>Confirmar</Button>
                            </>
                        :
                            <Loading
                                width="50px"
                                height="50px"
                                marginTop="0"
                            />
                    }
                </div>
            </Container>
        </Modal>
    )
}

export default DeleteModal
