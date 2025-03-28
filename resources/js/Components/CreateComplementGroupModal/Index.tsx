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
    GeneralRow5,
    GeneralRow6,
    GeneralRow7,
    GeneralRow8
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import TextAreaWithLabel from "../TextAreaWithLabel"
import { Branch, Company, EditComplementGroupForm } from "@/utils/interfaces"

import api from "@/Services/api";
import Loading from "../Loading";
import { usePage } from "@inertiajs/react"

interface ICreateComplementGroupModalProps {
    show: boolean,
    onClose(): void
}

const CreateComplementGroupModal: React.FC<ICreateComplementGroupModalProps> = ({ show, onClose }) => {

    const { props } = usePage()

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const branch = props.branch as Branch
    const company = props.company as Company

    const [formState, setFormState] = useState<EditComplementGroupForm>({
        active: true,
        title: '',
        description: '',
        code: '',
        ingredients: false,
        minimum: '',
        maximum: '',
        mandatory: false,
        branch: branch.id,
        company: company.id
    })

    const handleActive = (value: boolean, key: keyof EditComplementGroupForm) => {
        setFormState((prev) => {

            if (key === "active") {
                return {
                    ...prev,
                    active: value
                }
            }

            if (key === "ingredients") {
                return {
                    ...prev,
                    ingredients: value
                }
            }

            if (key === "mandatory") {
                return {
                    ...prev,
                    mandatory: value
                }
            }

            return prev
        })
    }

    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof EditComplementGroupForm
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
                title: '',
                description: '',
                code: '',
                ingredients: false,
                minimum: '',
                maximum: '',
                mandatory: false,
                branch: branch.id,
                company: company.id
            })
            onClose()
        }
    }

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true)

            event.preventDefault();

            await api.post('/create/complement-group', formState);

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
                                value={formState.title}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'title')}
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
                            <InputWithLabel
                                label="Código PDV"
                                value={formState.code}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'code')}
                            />
                        </GeneralRow4>

                        <GeneralRow5>
                            <InputWithLabel
                                label="Qtd. Mínima"
                                value={formState.minimum}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'minimum')}
                            />

                            <InputWithLabel
                                label="Qtd. Máxima"
                                value={formState.maximum}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'maximum')}
                            />
                        </GeneralRow5>

                        <GeneralRow6>
                            <Toggle
                                checked={formState.ingredients}
                                labelRight="É uma categoria de ingredientes?"
                                margin="0 7px 0 0"
                                onChange={() => handleActive(!formState.ingredients, "ingredients")}
                            />
                        </GeneralRow6>

                        <GeneralRow7>
                            <Toggle
                                checked={formState.mandatory}
                                labelRight="É um complemento obrigatório?"
                                margin="0 7px 0 0"
                                onChange={() => handleActive(!formState.mandatory, "mandatory")}
                            />
                        </GeneralRow7>

                        <GeneralRow8>
                            <div className="absolute bottom-0 right-0">
                                {!loading
                                    ? <Button type="submit">Salvar</Button>
                                    : <Loading />
                                }
                            </div>
                        </GeneralRow8>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateComplementGroupModal
