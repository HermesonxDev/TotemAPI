import { useState } from "react"
import Modal from "../Modal"

import {
    Body,
    Container,
    Header,
    General,
    Button,
    Title,
    GeneralRow1,
    GeneralRow2,
    GeneralRow3,
    GeneralRow4,
} from "./styles"

import InputWithLabel from "../InputWithLabel"
import TextAreaWithLabel from "../TextAreaWithLabel"
import { Branch, Company, CreateComplementGroupCategoryForm } from "@/utils/interfaces"

import api from "@/Services/api";
import Loading from "../Loading";
import { usePage } from "@inertiajs/react"
import Toggle from "../Toggle"

interface ICreateComplementGroupCategoryModalProps {
    show: boolean,
    onClose(): void
}

const CreateComplementGroupCategoryModal: React.FC<ICreateComplementGroupCategoryModalProps> = ({ show, onClose }) => {

    const { props } = usePage()

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const branch = props.branch as Branch
    const company = props.company as Company

    const [formState, setFormState] = useState<CreateComplementGroupCategoryForm>({
        active: true,
        name: '',
        description: '',
        branch: branch.id,
        company: company.id,
    })

    const handleActive = (value: boolean, key: keyof CreateComplementGroupCategoryForm) => {
        setFormState((prev) => {
            if (key === "active") {
                return {
                    ...prev,
                    active: value
                }
            }
            return prev
        })
    }
        
    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof CreateComplementGroupCategoryForm
    ) => {
        const { value } = event.target as HTMLInputElement;

        setFormState((prev) => {
            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const closeForm = () => {
        if (saveData) {
            onClose()
        } else {
            setFormState({
                active: true,
                name: '',
                description: '',
                branch: branch.id,
                company: company.id,
            })
            onClose()
        }
    }

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true)

            event.preventDefault();

            await api.post('/create/complement-group-category', formState);

            window.location.reload();
        } catch (err: unknown) {
            setLoading(false)
            console.error(err);
        }
    };

    return (
        <Modal show={show} onClose={closeForm}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Editar Grupo de Complemento</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={closeForm}
                    >Sair</Button>
                </Header>

                <Body className="bg-gray-100" onSubmit={handleFormState} encType="multipart/form-data">
                    <General>
                        <GeneralRow1>
                            <Toggle
                                checked={formState.active}
                                labelRight="Ativo"
                                margin="0 7px 0 0"
                                onChange={() => handleActive(!formState.active, "active")}
                            />

                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={saveData}
                                    onChange={() => setSaveData(!saveData)}
                                /> Salvar Informações
                            </div>
                        </GeneralRow1>

                        <GeneralRow2>
                            <InputWithLabel
                                label="Nome"
                                value={formState.name}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'name')}
                            />
                        </GeneralRow2>

                        <GeneralRow3>
                            <TextAreaWithLabel
                                label="Descrição"
                                value={formState.description}
                                onChange={(e) => handleChangeOrder(e, 'description')}
                            />
                        </GeneralRow3>

                        <GeneralRow4>
                            <div className="absolute bottom-0 right-0">
                                {!loading
                                    ? <Button type="submit">Salvar</Button>
                                    : <Loading />
                                }
                            </div>
                        </GeneralRow4>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateComplementGroupCategoryModal
