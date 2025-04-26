import { useEffect, useState } from "react"
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

import InputWithLabel from "../InputWithLabel"
import { Branch, Company, CreateUserForm, OptionType, UserModalLoadings } from "@/utils/interfaces"
import api from "@/Services/api";
import Loading from "../Loading";
import AsyncMultiSelect from "../AsyncMultiSelect"

interface ICreateUserModalProps {
    show: boolean,
    onClose(): void
}

const CreateUserModal: React.FC<ICreateUserModalProps> = ({ show, onClose }) => {

    const [saveData, setSaveData] = useState<boolean>(false)

    const [formState, setFormState] = useState<CreateUserForm>({
        name: '',
        email: '',
        password: '',
        role: '',
        companies: [],
        branches: []
    })

    const [loading, setLoading] = useState<UserModalLoadings>({
        page: false,
        companies: false,
        branches: false
    })

    const [companies, setCompanies] = useState<OptionType[]>([])
    const [branches, setBranches] = useState<OptionType[]>([])

    const handleLoadings = (option: keyof UserModalLoadings, value: boolean) => {
        setLoading({
            page: false,
            companies: false,
            branches: false,
            [option]: value
        })
    }

    const getCompanies = async (inputValue: string): Promise<OptionType[]> => {
        const response = await api('/list/companies');
        const data = response.data.data as Company[]

        return data.map(company => ({
            value: company._id,
            label: company.name,
        }))
    }

    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof CreateUserForm,
        overwrite?: boolean
    ) => {
        const { value } = event.target as HTMLInputElement | HTMLSelectElement;
      
        setFormState((prev) => {
          const prevValue = prev[key];

          if (Array.isArray(prevValue)) {
            if (overwrite) {
              return {
                ...prev,
                [key]: [value],
              };
            } else {
              const updatedArray = prevValue.includes(value) ? prevValue : [...prevValue, value];
      
              return {
                ...prev,
                [key]: updatedArray,
              };
            }
          }
      
          return {
            ...prev,
            [key]: value,
          };
        });
    };      

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            handleLoadings('page', true)

            const formData = new FormData();

            Object.entries(formState).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        formData.append(`${key}[]`, item);
                    });
                } else {
                    formData.append(key, String(value));
                }
            });            

            await api.post('/create/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            window.location.reload();
        } catch (err: unknown) {
            handleLoadings('page', false)
            console.error("Erro no handleFormState: ", err);
        }
    };

    const closeForm = () => {
        if (saveData) {
            onClose()
        } else {
            setFormState({
                name: '',
                email: '',
                password: '',
                role: '',
                companies: [],
                branches: []
            })
            onClose()
        }
    }

    useEffect(() => {
        const fetchCompanies = async () => {
            handleLoadings('companies', true)
            handleLoadings('branches', true)

            const response = await api.get('/list/companies');
            const data = response.data.data as Company[]
            setCompanies(data.map(company => ({
                value: company._id,
                label: company.name,
            })))

            handleLoadings('companies', false)
            handleLoadings('branches', false)
        }

        const fecthBranches = async (company: string) => {
            handleLoadings('branches', true)

            const response = await api.get(`/list/branches?%24limit=50&company=${company}`)
            const data = response.data.data as Branch[]

            setBranches(data.map(company => ({
                value: company?._id || '',
                label: company.name,
            })))

            handleLoadings('branches', false)
        }

        if (formState.role === 'manager') {
            fetchCompanies()
        }

        if (formState.role === 'manager' && formState.companies && formState.companies[0]) {
            fecthBranches(formState.companies[0])
        }
    }, [formState.role, formState.companies])

    return (
        <Modal show={show} onClose={closeForm}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Criar Usuário</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={closeForm}
                    >Sair</Button>
                </Header>

                <Body className="bg-gray-100" onSubmit={handleFormState} encType="multipart/form-data">
                    <General>
                        <GeneralRow1>
                            <div></div>

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
                                value={formState.password}
                                height="70%"
                                type="password"
                                onChange={(e) => handleChangeOrder(e, 'password')}
                            />
                        </GeneralRow4>

                        <GeneralRow5>
                            <select
                                className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                value={formState.role}
                                onChange={(e) => handleChangeOrder(e, "role")}
                            >
                                <option value="" disabled hidden>Nivel de Usuário</option>
                                <option value="admin">Administrador</option>
                                <option value="consultant">Consultor</option>
                                <option value="manager">Gerente</option>
                            </select>
                        </GeneralRow5>

                        <GeneralRow6>
                            {formState.role === 'consultant' &&
                                <AsyncMultiSelect
                                    loadData={getCompanies}
                                    placeholder="Digite para buscar uma franquia"
                                    defaultOptions={true}
                                    onChange={(selectedOptions) =>
                                        setFormState((prev) => ({
                                          ...prev,
                                          companies: selectedOptions.map(option => option.value)
                                        }))
                                    }                                      
                                />
                            }

                            {formState.role === 'manager' && !loading.companies &&
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.companies}
                                    onChange={(e) => handleChangeOrder(e, "companies", true)}
                                >
                                    <option value="" disabled hidden>Franquia</option>
                                    {companies.map(company => (
                                        <>
                                            <option value={company.value}>{company.label}</option>
                                        </>
                                    ))}
                                </select>
                            }
                        </GeneralRow6>

                        <GeneralRow7>
                            {formState.role === 'manager' && !loading.branches &&
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.branches}
                                    onChange={(e) => handleChangeOrder(e, "branches", true)}
                                >
                                    <option value="" disabled hidden>Unidade</option>
                                    {branches.map(branch => (
                                        <>
                                            <option value={branch.value}>{branch.label}</option>
                                        </>
                                    ))}
                                </select>
                            }
                        </GeneralRow7>
                        
                        <GeneralRow8>
                            <div className="absolute bottom-0 right-0">
                                {!loading.page
                                    ? <Button type="submit">Salvar</Button>
                                    : <Loading width="50px" />
                                }
                            </div>
                        </GeneralRow8>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateUserModal
