import { useEffect, useState } from "react"
import Modal from "../Modal"
import ObjectId from 'bson-objectid';
import { usePage } from '@inertiajs/react';

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
    Photo,
    PhotoRow1,
    PhotoRow2,
    PhotoRow3,
    AditionalInformation,
    AditionalInformationRow1,
    AditionalInformationRow2,
    AditionalInformationRow3,
    AditionalInformationRow4,
    ProductImage,
    AditionalInformationRow5,
    AditionalInformationRow6,
    AditionalInformationRow7,
    AditionalInformationRow8,
    AditionalInformationRow9,
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import {
    CreateUserForm,
    CreateUserFormOptions,
    Image as ImageInterface
} from "@/utils/interfaces"
import api from "@/Services/api";
import Loading from "../Loading";

interface ICreateUserModalProps {
    show: boolean,
    onClose(): void
}

const CreateUserModal: React.FC<ICreateUserModalProps> = ({ show, onClose }) => {

    const MAX_IMAGES = {
        photo: 1
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const [formState, setFormState] = useState<CreateUserForm>({
        active: true,
        birthDate: '',
        cpf: '',
        cnpj: '',
        email: '',
        gender: '',
        name: '',
        password: '',
        phone: '',
        externalId: '',
        role: '',
        superuser: false,
        noAuthUser: false,
        photo: [],
        latitude: '',
        longitude: '',
        postalCode: '',
        reference: '',
        complement: '',
        state: '',
        city: '',
        neighborhood: '',
        street: '',
        number: ''
    })

    const [menuOptions, setMenuOptions] = useState<CreateUserFormOptions>({
        general: true,
        photo: false,
        aditionalInformations: false
    })

    const handleMenuClick = (option: keyof CreateUserFormOptions) => {
        setMenuOptions({
            general: false,
            photo: false,
            aditionalInformations: false,
            [option]: true
        })
    }

    const handleToggle = (value: boolean, key: keyof CreateUserForm) => {
        setFormState((prev) => ({
            ...prev,
            [key]: value
        }));
    };


    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof CreateUserForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {
            if (key === "photo" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    photo: [...prev.photo, ...newImages]
                };
            }

            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof MAX_IMAGES, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newImage: ImageInterface = {
            photo: URL.createObjectURL(file),
            preferredType: "photo",
            _id: new ObjectId().toString(),
            active: true,
            isNew: true,
        };

        setFormState((prev) => {
            const updatedImages = [...prev[fieldName]];
            updatedImages[index] = newImage;
            return { ...prev, [fieldName]: updatedImages };
        });
    };


    const handleAddImageSlot = (fieldName: keyof typeof MAX_IMAGES) => {
        setFormState((prev) => {
            if (prev[fieldName].length < MAX_IMAGES[fieldName]) {
                return {
                    ...prev,
                    [fieldName]: [
                        ...prev[fieldName],
                        {
                            photo: "",
                            preferredType: "photo",
                            _id: new ObjectId().toString(),
                            active: true,
                            isNew: true
                        },
                    ],
                };
            }
            return prev;
        });
    };


    const handleRemoveImage = (fieldName: keyof typeof MAX_IMAGES, index: number) => {
        setFormState((prev) => {
            const updatedImages = prev[fieldName].filter((_, i) => i !== index);
            return { ...prev, [fieldName]: updatedImages };
        });
    };


    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading(true);

            const formData = new FormData();

            Object.keys(formState).forEach((key) => {
                const value = formState[key as keyof typeof formState];

                if (typeof value === "boolean" || typeof value === "number") {
                    formData.append(key, String(value));
                } else if (typeof value === "string") {
                    formData.append(key, value);
                }
            });

            const imageFields = [
                "photo"
            ] as const;

            for (const field of imageFields) {
                const images = formState[field];

                for (const [index, image] of images.entries()) {
                    if (image.isNew) {
                        if (image.photo instanceof File) {
                            formData.append(`${field}[${index}]`, image.photo, image.photo.name);
                        } else if (typeof image.photo === "string" && image.photo.startsWith("blob:")) {
                            const response = await fetch(image.photo);
                            const blob = await response.blob();
                            const file = new File([blob], `image-${index}.jpg`, { type: blob.type });

                            formData.append(`${field}[${index}]`, file, file.name);
                        } else {
                            console.warn(`A imagem ${index} de ${field} não é um File nem um Blob válido!`, image.photo);
                        }
                    }
                }
            }

            await api.post('/create/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

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
                birthDate: '',
                cpf: '',
                cnpj: '',
                email: '',
                gender: '',
                name: '',
                password: '',
                phone: '',
                externalId: '',
                role: '',
                superuser: false,
                noAuthUser: false,
                photo: [],
                latitude: '',
                longitude: '',
                postalCode: '',
                reference: '',
                complement: '',
                state: '',
                city: '',
                neighborhood: '',
                street: '',
                number: ''
            })
            onClose()
        }
    }
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
                    <Menu>
                        <Button
                            type="button"
                            onClick={() => handleMenuClick('general')}
                            backgroundColor={menuOptions.general ? "black" : "unset"}
                            color={menuOptions.general ? "white" : "black"}
                        >Geral</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('photo')}
                            backgroundColor={menuOptions.photo ? "black" : "unset"}
                            color={menuOptions.photo ? "white" : "black"}
                        >Foto</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('aditionalInformations')}
                            backgroundColor={menuOptions.aditionalInformations ? "black" : "unset"}
                            color={menuOptions.aditionalInformations ? "white" : "black"}
                        >Informações Adicionais</Button>
                    </Menu>

                    {menuOptions.general &&
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
                                    value={formState.password}
                                    height="70%"
                                    type="password"
                                    onChange={(e) => handleChangeOrder(e, 'password')}
                                />
                            </GeneralRow4>

                            <GeneralRow5>
                                <InputWithLabel
                                    label="Telefone"
                                    value={formState.phone}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'phone')}
                                />

                                <InputWithLabel
                                    label="Data de Nascimento"
                                    value={formState.birthDate}
                                    height="70%"
                                    type="date"
                                    onChange={(e) => handleChangeOrder(e, 'birthDate')}
                                />
                            </GeneralRow5>

                            <GeneralRow6>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.gender}
                                    onChange={(e) => handleChangeOrder(e, "gender")}
                                >
                                    <option value="" disabled hidden>Gênero</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                </select>
                            </GeneralRow6>

                            <GeneralRow7>
                                <InputWithLabel
                                    label="CPF"
                                    value={formState.cpf}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'cpf')}
                                />

                                <InputWithLabel
                                    label="CNPJ"
                                    value={formState.cnpj}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'cnpj')}
                                />
                            </GeneralRow7>

                            <GeneralRow8>
                                <InputWithLabel
                                    label="Código PDV"
                                    value={formState.externalId}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'externalId')}
                                />
                            </GeneralRow8>

                            <GeneralRow9>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.role}
                                    onChange={(e) => handleChangeOrder(e, "role")}
                                >
                                    <option value="" disabled hidden>Nivel de Usuário</option>
                                    <option value="user">Usuário</option>
                                    <option value="Admin">Administrador</option>
                                    <option value="Owner">Dono</option>
                                    <option value="Partner">Sócio</option>
                                    <option value="Manager">Gerente</option>
                                </select>
                            </GeneralRow9>

                            <GeneralRow10>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </GeneralRow10>
                        </General>
                    }

                    {menuOptions.photo &&
                        <Photo>
                            <PhotoRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para a Foto.</Title>
                            </PhotoRow1>

                            {formState.photo.map((image, index) => (
                                <PhotoRow2>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded w-full"
                                        onChange={(e) => handleImageUpload(e, "photo", index)}
                                    />

                                    {image.photo && (
                                        <div className="flex flex-row gap-3 items-center">
                                            <ProductImage
                                                src={typeof image.photo === "string" ? image.photo : URL.createObjectURL(image.photo)}
                                            />

                                            <div className="flex flex-col gap-3">
                                                <Toggle
                                                    checked={image.active}
                                                    labelRight="Ativo"
                                                    margin="0 7px 0 0"
                                                    onChange={() => {}}
                                                />

                                                <Button type="button" onClick={() => handleRemoveImage("photo", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </PhotoRow2>
                            ))}

                            <PhotoRow3>
                                {!loading
                                    ? <>
                                        {formState.photo.length < MAX_IMAGES.photo && (
                                            <Button type="button" onClick={() => handleAddImageSlot("photo")}>
                                                Adicionar Mais Uma Imagem
                                            </Button>
                                        )}

                                        <Button type="submit">Salvar</Button>
                                      </>
                                    : <Loading width="50px" />
                                }
                            </PhotoRow3>
                        </Photo>
                    }

                    {menuOptions.aditionalInformations &&
                        <AditionalInformation>
                            <AditionalInformationRow1>
                                <Toggle
                                    checked={formState.superuser}
                                    labelRight="Super Usuário"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.superuser, "superuser")}
                                />

                                <Toggle
                                    checked={formState.noAuthUser}
                                    labelRight="Sem Autenticação"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.noAuthUser, "noAuthUser")}
                                />
                            </AditionalInformationRow1>

                            <AditionalInformationRow2>
                                <InputWithLabel
                                    label="Rua"
                                    value={formState.street}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'street')}
                                />
                            </AditionalInformationRow2>

                            <AditionalInformationRow3>
                                <InputWithLabel
                                    label="Número"
                                    value={formState.number}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'number')}
                                />
                            </AditionalInformationRow3>

                            <AditionalInformationRow4>
                                <InputWithLabel
                                    label="Bairro"
                                    value={formState.neighborhood}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'neighborhood')}
                                />
                            </AditionalInformationRow4>

                            <AditionalInformationRow5>
                                <InputWithLabel
                                    label="CEP"
                                    value={formState.postalCode}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'postalCode')}
                                />
                            </AditionalInformationRow5>

                            <AditionalInformationRow6>
                                <InputWithLabel
                                    label="Complemento"
                                    value={formState.complement}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'complement')}
                                />

                                <InputWithLabel
                                    label="Referência"
                                    value={formState.reference}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'reference')}
                                />
                            </AditionalInformationRow6>

                            <AditionalInformationRow7>
                                <InputWithLabel
                                    label="Cidade"
                                    value={formState.city}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'city')}
                                />

                                <InputWithLabel
                                    label="Estado"
                                    value={formState.state}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'state')}
                                />
                            </AditionalInformationRow7>

                            <AditionalInformationRow8>
                                <InputWithLabel
                                    label="Latitude"
                                    value={formState.latitude}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'latitude')}
                                />

                                <InputWithLabel
                                    label="Longitude"
                                    value={formState.longitude}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'longitude')}
                                />
                            </AditionalInformationRow8>

                            <AditionalInformationRow9>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </AditionalInformationRow9>
                        </AditionalInformation>
                    }
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateUserModal
