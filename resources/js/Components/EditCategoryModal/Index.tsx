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
import { Category, CategoryForm, Image as ImageInterface } from "@/utils/interfaces"

import api from "@/Services/api";
import Loading from "../Loading";
import { ProductImage } from "../EditProductModal/styles";

interface IEditCategoryModalProps {
    show: boolean,
    editedCategory: Category | null,
    onClose(): void
}

const EditCategoryModal: React.FC<IEditCategoryModalProps> = ({
    show,
    editedCategory,
    onClose
}) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [formState, setFormState] = useState<CategoryForm>({
        id: "",
        active: true,
        name: '',
        description: '',
        slug: '',
        staticImage: [],
        staticImageTotem: [],
        branch: ""
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

    const handleStaticImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newImage: ImageInterface = {
            photo: file,
            _id: new ObjectId().toString(),
            active: true,
            isNew: true
        };

        setFormState((prev) => {
            const updatedImages = [...prev.staticImage];
            updatedImages[index] = newImage;
            return { ...prev, staticImage: updatedImages };
        });
    };

    const handleStaticImageTotemUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newImage: ImageInterface = {
            photo: file,
            _id: new ObjectId().toString(),
            active: true,
            isNew: true
        };

        setFormState((prev) => {
            const updatedImages = [...prev.staticImageTotem];
            updatedImages[index] = newImage;
            return { ...prev, staticImageTotem: updatedImages };
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
            })

            formState.staticImage.forEach((image) => {
                if (image.isNew && image.photo instanceof File) {
                    formData.append("staticImage[]", image.photo);
                }
            })

            formState.staticImageTotem.forEach((image) => {
                if (image.isNew && image.photo instanceof File) {
                    formData.append("staticImageTotem[]", image.photo);
                }
            })

            const existingStaticImages = formState.staticImage
                .filter(image => !image.isNew)
                .map(image => image.photo)

            const existingStaticImagesTotem = formState.staticImageTotem
                .filter(image => !image.isNew)
                .map(image => image.photo)

            formData.append("existingStaticImages", JSON.stringify(existingStaticImages));
            formData.append("existingStaticImagesTotem", JSON.stringify(existingStaticImagesTotem));

            await api.post('/edit/category', formData, {
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

    useEffect(() => {
        if (editedCategory) {

            const staticImage =
                editedCategory.staticImage?.map((img) => ({
                    photo: img.photo,
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: false
                })) || [];

            const staticImageTotem =
                editedCategory.staticImageTotem?.map((img) => ({
                    photo: img.photo,
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: false
            })) || [];

            setFormState({
                id: editedCategory?._id,
                active: editedCategory?.active,
                name: editedCategory?.name || "",
                description: editedCategory?.description || "",
                slug: editedCategory?.slug || "",
                staticImage: staticImage,
                staticImageTotem: staticImageTotem,
                branch: editedCategory?.branch
            });
        }
    }, [editedCategory]);
    
    return (
        <Modal show={show} onClose={onClose}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Editar Categoria</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={onClose}
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

                            <h2></h2>
                        </GeneralRow1>

                        <GeneralRow2>
                            <Title>Imagem para aplicativo e site (max 300kb).</Title>

                            {formState.staticImage.map((image, index) => (

                                    <div key={index}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="border border-gray-400 rounded"
                                            onChange={(e) => handleStaticImageUpload(e, index)}
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
                                                </div>
                                            </div>
                                        )}
                                    </div>
                            ))}
                        </GeneralRow2>

                        <GeneralRow3>
                            <Title>Imagem para o totem (max 300kb).</Title>

                            {formState.staticImageTotem.map((image, index) => (
                                <div key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded"
                                        onChange={(e) => handleStaticImageTotemUpload(e, index)}
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
                                            </div>
                                        </div>
                                    )}
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
                            <div className="absolute bottom-0 right-0">
                                {!loading
                                    ? <Button type="submit">Salvar</Button>
                                    : <Loading width="40px" height="40px"/>
                                }
                            </div>
                        </GeneralRow7>
                    </General>
                </Body>
            </Container>
        </Modal>
    )
}

export default EditCategoryModal
