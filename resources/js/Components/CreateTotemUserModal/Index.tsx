import { useState } from "react"
import Modal from "../Modal"

import {
    Body,
    Container,
    Header,
    Menu,
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
    GeneralRow8,
    GeneralRow9,
    GeneralRow10,
    GeneralRow11,
    GeneralRow12,
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import { Branch, Company, TotemUserForm } from "@/utils/interfaces"
import api from "@/Services/api";
import Loading from "../Loading";
import { usePage } from "@inertiajs/react"

interface ICreateTotemUserModalProps {
    show: boolean,
    onClose(): void
}

const CreateTotemUserModal: React.FC<ICreateTotemUserModalProps> = ({ show, onClose }) => {

    const { props } = usePage()

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const branch = props.branch as Branch
    const company = props.company as Company

    const [formState, setFormState] = useState<TotemUserForm>({
        active: true,
        branch: branch ? branch.id : "",
        company: company ? company.id : "",
        email: '',
        name: '',
        maxConcurrentLogins: '',
        password: '',
        tefCNPJ: '',
        tefCompany: '',
        tefComunication: '',
        tefIpAddress: '',
        tefOtp: '',
        tefTerminal: ''
    })

    const handleToggle = (value: boolean, key: keyof TotemUserForm) => {
        setFormState((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof TotemUserForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {

            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            setLoading(true);

            await api.post('/create/totem-user', formState)

            window.location.reload();
        } catch (err: unknown) {
            setLoading(false);
            console.error("Erro no handleFormState: ", err);
        }
    };

    const closeForm = () => {
        if (saveData) {
            onClose()
        } else {
            setFormState({
                active: true,
                branch: branch ? branch.id : "",
                company: company ? company.id : "",
                email: '',
                name: '',
                maxConcurrentLogins: '',
                password: '',
                tefCNPJ: '',
                tefCompany: '',
                tefComunication: '',
                tefIpAddress: '',
                tefOtp: '',
                tefTerminal: ''
            })
            onClose()
        }
    }
    return (
        <Modal show={show} onClose={closeForm}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Criar Usuário Totem</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={closeForm}
                    >Sair</Button>
                </Header>

                <Body className="bg-gray-100" onSubmit={handleFormState} encType="multipart/form-data">
                    <Menu>
                        <Button
                            type="button"
                            backgroundColor="black"
                            color="white"
                        >Geral</Button>
                    </Menu>

                    <General>
                        <GeneralRow1>
                            <Toggle
                                checked={formState.active}
                                labelRight="Ativo"
                                margin="0 7px 0 0"
                                onChange={() => handleToggle(!formState.active, "active")}
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
                            <InputWithLabel
                                label="Email"
                                value={formState.email}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'email')}
                            />
                        </GeneralRow3>

                        <GeneralRow4>
                            <InputWithLabel
                                label="Senha"
                                type="password"
                                value={formState.password}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'password')}
                            />
                        </GeneralRow4>

                        <GeneralRow5>
                            <InputWithLabel
                                label="Logins Permitidos"
                                value={formState.maxConcurrentLogins}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'maxConcurrentLogins')}
                            />
                        </GeneralRow5>

                        <GeneralRow6>
                            <InputWithLabel
                                label="Endereço IP TEF"
                                value={formState.tefIpAddress}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'tefIpAddress')}
                            />
                        </GeneralRow6>

                        <GeneralRow7>
                            <InputWithLabel
                                label="Empresa TEF"
                                value={formState.tefCompany}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'tefCompany')}
                            />
                        </GeneralRow7>

                        <GeneralRow8>
                            <InputWithLabel
                                label="CNPJ TEF"
                                value={formState.tefCNPJ}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'tefCNPJ')}
                            />
                        </GeneralRow8>

                        <GeneralRow9>
                            <InputWithLabel
                                label="Terminal TEF"
                                value={formState.tefTerminal}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'tefTerminal')}
                            />
                        </GeneralRow9>

                        <GeneralRow10>
                            <InputWithLabel
                                label="Comunicação TEF"
                                value={formState.tefComunication}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'tefComunication')}
                            />
                        </GeneralRow10>

                        <GeneralRow11>
                            <InputWithLabel
                                label="OTP TEF"
                                value={formState.tefOtp}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'tefOtp')}
                            />
                        </GeneralRow11>

                        <GeneralRow12>
                            <div className="absolute bottom-0 right-0">
                                {!loading
                                    ? <Button type="submit">Salvar</Button>
                                    : <Loading width="50px" />
                                }
                            </div>
                        </GeneralRow12>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateTotemUserModal
