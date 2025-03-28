import { useState } from "react"
import Modal from "../Modal"
import ObjectId from 'bson-objectid';

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
import { Branch, Company, ComplementForm, Image as ImageInterface } from "@/utils/interfaces"

import api from "@/Services/api";
import Loading from "../Loading";
import { ProductImage } from "../EditProductModal/styles";
import { usePage } from "@inertiajs/react";

interface ICreateComplementModalProps {
    show: boolean,
    onClose(): void
}

const CreateComplementModal: React.FC<ICreateComplementModalProps> = ({ show, onClose }) => {

    const { props } = usePage()

    const MAX_IMAGES = 1

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const branch = props.branch as Branch
    const company = props.company as Company
    const complement = props.complementID

    const [formState, setFormState] = useState<ComplementForm>({
        active: true,
        name: '',
        description: '',
        price: '',
        preparationTime: '',
        code: '',
        images: [],
        branch: branch.id,
        company: company.id,
        complement: complement
    })

    const handleActive = (value: boolean) => {
        setFormState((prev) => {
            return {
                ...prev,
                active: value
            }
        })
    }

    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof ComplementForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {
            if (key === "images" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    images: [...prev.images, ...newImages]
                };
            }

            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const handleAddImageSlot = () => {
        setFormState((prev) => {
            if (prev.images.length < MAX_IMAGES) {
                return {
                    ...prev,
                    images: [
                        ...prev.images,
                        {
                            photo: "",
                            preferredType: "photo",
                            _id: new ObjectId().toString(),
                            active: true,
                            isNew: true
                        }
                    ],
                };
            }
            return prev;
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newImage: ImageInterface = {
            photo: file,
            _id: new ObjectId().toString(),
            active: true,
            isNew: true
        };

        setFormState((prev) => {
            const updatedImages = [...prev.images];
            updatedImages[index] = newImage;
            return { ...prev, images: updatedImages };
        });
    };

    const handleRemoveImage = (index: number) => {
        setFormState((prev) => {
            const updatedImages = prev.images.filter((_, i) => i !== index);
            return { ...prev, images: updatedImages };
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
                price: '',
                preparationTime: '',
                code: '',
                images: [],
                branch: branch.id,
                company: company.id,
                complement: complement
            })
            onClose()
        }
    }

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true)
            event.preventDefault();

            const formData = new FormData();
            
            Object.keys(formState).forEach((key) => {
                const value = formState[key as keyof typeof formState];

                if (typeof value === "boolean" || typeof value === "number") {
                    formData.append(key, String(value));
                } else if (typeof value === "string") {
                    formData.append(key, value);
                }
            });

            formState.images.forEach((image) => {
                if (image.isNew && image.photo instanceof File) {
                    formData.append("images[]", image.photo);
                }
            });

            const existingImages = formState.images
                .filter(image => !image.isNew)
                .map(image => image.photo);

            formData.append("existingImages", JSON.stringify(existingImages));

            await api.post('create/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

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
                    <Title margin="1rem 0 0 0.75rem">Editar Complemento</Title>
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
                                onChange={() => handleActive(!formState.active)}
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
                            {formState.images.map((image, index) => (
                                <div key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded"
                                        onChange={(e) => handleImageUpload(e, index)}
                                    />

                                    {image.photo && (
                                        <div className="flex flex-row mt-[10px] gap-3">
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

                                                <Button type="button" onClick={() => handleRemoveImage(index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </GeneralRow2>

                        <GeneralRow3>
                            <InputWithLabel
                                label="Nome"
                                value={formState.name}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'name')}
                            />
                        </GeneralRow3>

                        <GeneralRow4>
                            <TextAreaWithLabel
                                label="Descrição"
                                value={formState.description}
                                onChange={(e) => handleChangeOrder(e, 'description')}
                            />
                        </GeneralRow4>

                        <GeneralRow5>
                            <InputWithLabel
                                label="Código PDV"
                                value={formState.code}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'code')}
                            />
                        </GeneralRow5>

                        <GeneralRow6>
                            <InputWithLabel
                                label="Tempo de preparo (em minutos)"
                                value={formState.preparationTime}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'preparationTime')}
                            />
                        </GeneralRow6>

                        <GeneralRow7>
                            <InputWithLabel
                                label="Preço"
                                value={formState.price}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'price')}
                            />
                        </GeneralRow7>

                        <GeneralRow8>
                            {!loading
                                ? <>
                                    {formState.images.length < MAX_IMAGES && (
                                        <Button
                                            type="button"
                                            onClick={handleAddImageSlot}
                                            height="30px"
                                            margin="auto 0 0 0"
                                        > Adicionar Mais Uma Imagem </Button>
                                    )}

                                    <Button
                                        type="submit"
                                        height="30px"
                                        margin="auto 0 0 0"
                                    >Salvar</Button>
                                  </>
                                : <Loading />
                            }
                        </GeneralRow8>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateComplementModal
