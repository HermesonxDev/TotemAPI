import { useEffect, useState } from "react"
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
    GeneralRow4,
    GeneralRow5,
    GeneralRow6,
    GeneralRow7,
    GeneralRow2,
    GeneralRow3
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import TextAreaWithLabel from "../TextAreaWithLabel"
import {
    Branch,
    Company,
    CategoryForm,
    Image as ImageInterface
} from "@/utils/interfaces"

import api from "@/Services/api";
import Loading from "../Loading";
import { ProductImage } from "../EditProductModal/styles";
import { usePage } from "@inertiajs/react";

interface ICreateCategoryModalProps {
    show: boolean,
    onClose(): void
}

const CreateCategoryModal: React.FC<ICreateCategoryModalProps> = ({ show, onClose }) => {

    const { props } = usePage()

    const MAX_IMAGES = {
        staticImage: 1,
        staticImageTotem: 1
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const branch = props.branch as Branch
    const company = props.company as Company

    const [formState, setFormState] = useState<CategoryForm>({
        active: true,
        name: '',
        description: '',
        slug: '',
        staticImage: [],
        staticImageTotem: [],
        branch: branch.id,
        company: company.id
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
        key: keyof CategoryForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {
            if (key === "staticImage" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    staticImage: [...prev.staticImage, ...newImages]
                };
            }

            if (key === "staticImageTotem" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    staticImageTotem: [...prev.staticImageTotem, ...newImages]
                };
            }

            const updatedState = { ...prev, [key]: value };

            if (key === "name") {
                updatedState.slug = generateSlug(value);
            }
            return updatedState;
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

    const closeForm = () => {
        if (saveData) {
            onClose()
        } else {
            setFormState({
                active: true,
                name: '',
                description: '',
                slug: '',
                staticImage: [],
                staticImageTotem: [],
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
                "staticImage",
                "staticImageTotem"
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

            await api.post('/create/category', formData, {
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
                    <Title margin="1rem 0 0 0.75rem">Criar Categoria</Title>
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
                            <Title>Imagem para aplicativo e site (300KB - 3MB) .</Title>

                            {formState.staticImage.map((image, index) => (

                                    <div key={index}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="border border-gray-400 rounded"
                                            onChange={(e) => handleImageUpload(e, 'staticImage', index)}
                                        />

                                        {image.photo &&
                                            <div className="flex flex-row gap-3 items-center mt-2">
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

                                                    <Button type="button" onClick={() => handleRemoveImage("staticImage", index)}>
                                                        Remover
                                                    </Button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                            ))}
                        </GeneralRow2>

                        <GeneralRow3>
                            <Title>Imagem para o totem (300KB - 3MB) .</Title>

                            {formState.staticImageTotem.map((image, index) => (
                                <div key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded"
                                        onChange={(e) => handleImageUpload(e, 'staticImageTotem', index)}
                                    />

                                    {image.photo &&
                                        <div className="flex flex-row gap-3 items-center mt-2">
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

                                                <Button type="button" onClick={() => handleRemoveImage("staticImageTotem", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}
                        </GeneralRow3>

                        <GeneralRow4>
                            <InputWithLabel
                                label="Nome"
                                value={formState.name}
                                height="70%"
                                onChange={(e) => handleChangeOrder(e, 'name')}
                            />
                        </GeneralRow4>

                        <GeneralRow5>
                            <TextAreaWithLabel
                                label="Descrição"
                                value={formState.description}
                                onChange={(e) => handleChangeOrder(e, 'description')}
                            />
                        </GeneralRow5>

                        <GeneralRow6>
                            <InputWithLabel
                                label="Slug"
                                value={formState.slug}
                                height="70%"
                                readOnly
                            />
                        </GeneralRow6>

                        <GeneralRow7>
                            {!loading
                                ? <>
                                    {formState.staticImage.length < MAX_IMAGES.staticImage && (
                                        <Button
                                            type="button"
                                            onClick={() => handleAddImageSlot("staticImage")}
                                            fontSize="14px"
                                            padding="3px 6px"
                                        > Add Imagem do Aplicativo </Button>
                                    )}

                                    {formState.staticImageTotem.length < MAX_IMAGES.staticImageTotem && (
                                        <Button
                                            type="button"
                                            onClick={() => handleAddImageSlot("staticImageTotem")}
                                            fontSize="14px"
                                            padding="3px 6px"
                                        > Add Imagem do Totem </Button>
                                    )}

                                    <Button type="submit">Salvar</Button>
                                </>
                                : <Loading width="50px" />
                            }
                        </GeneralRow7>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateCategoryModal
