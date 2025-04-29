import { useEffect, useState } from "react"
import Modal from "../Modal"
import ObjectId from 'bson-objectid';

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
    Image,
    ImageRow1,
    ProductImage,
    ImageRow5,
    Availability,
    Complements,
    GeneralRow9,
    AvailabilityRow1,
    AvailabilityRow2,
    AvailabilityRow3,
    ComplementsRow1,
    ComplementsRow2,
    ComplementsRow3,
    ImageRow,
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import TextAreaWithLabel from "../TextAreaWithLabel"
import { Complement, ProductForm, ProductFormOptions, Image as ImageInterface, Product } from "@/utils/interfaces"

import RadioWithLabel from "../RadioWithLabel"
import CheckBoxWithLabel from "../CheckBoxWithLabel"
import api from "@/Services/api";
import Loading from "../Loading";

interface IEditProductModalProps {
    show: boolean,
    editedProduct: Product | null,
    categoriesComplements?: Complement[],
    onClose(): void
}

const EditProductModal: React.FC<IEditProductModalProps> = ({
    show,
    editedProduct,
    categoriesComplements,
    onClose
}) => {

    const MAX_IMAGES = 3

    const [loading, setLoading] = useState<boolean>(false);

    const [formState, setFormState] = useState<ProductForm>({
        id: '',
        active: true,
        name: '',
        description: '',
        slug: '',
        price: '',
        preparationTime: '',
        code: '',
        barCode: '',
        images: [],
        period: '',
        complements: [],
        branch: ''
    })

    const [menuOptions, setMenuOptions] = useState<ProductFormOptions>({
        general: true,
        image: false,
        availability: false,
        complements: false
    })

    const handleMenuClick = (option: keyof ProductFormOptions) => {
        setMenuOptions({
            general: false,
            image: false,
            availability: false,
            complements: false,
            [option]: true
        })
    }

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
        key: keyof ProductForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {
            if (key === "images" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    images: [...prev.images, ...newImages]
                };
            }

            if (key === "period") {
                return {
                    ...prev,
                    period: value
                };
            }

            if (key === "complements") {
                let updatedComplements;

                if (checked) {
                    updatedComplements = [
                        ...prev.complements,
                        { name: categoriesComplements?.find(c => c._id === value)?.title || "", order: prev.complements.length + 1, _id: value }
                    ];
                } else {
                    updatedComplements = prev.complements
                        .filter((addon) => addon._id !== value)
                        .map((addon, index) => ({ ...addon, order: index + 1 }));
                }

                return {
                    ...prev,
                    complements: updatedComplements
                };
            }

            const updatedState = { ...prev, [key]: value };

            if (key === "name") {
                updatedState.slug = generateSlug(value);
            }

            return updatedState;
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newImage: ImageInterface = {
            photo: file,
            preferredType: "photo",
            _id: new ObjectId().toString(),
            active: true,
            isNew: true,
        };

        setFormState((prev) => {
            const updatedImages = [...prev.images];
            updatedImages[index] = newImage;
            return { ...prev, images: updatedImages };
        });
    };

    const handleAddImageSlot = () => {
        setFormState((prev) => {
            if (prev.images.length < MAX_IMAGES) {
                return {
                    ...prev,
                    images: [
                        ...prev.images,
                        { photo: "", preferredType: "photo", _id: new ObjectId().toString(), active: true, isNew: true },
                    ],
                };
            }
            return prev;
        });
    };

    const handleRemoveImage = (index: number) => {
        setFormState((prev) => {
            const updatedImages = prev.images.filter((_, i) => i !== index);
            return { ...prev, images: updatedImages };
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
            setLoading(true);
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
            
            formState.images.forEach((image) => {
                if (image.isNew && image.photo instanceof File) {
                    formData.append("images[]", image.photo);
                }
            })

            const existingImages = formState.images
                .filter(image => !image.isNew)
                .map(image => image.photo);

            formData.append("existingImages", JSON.stringify(existingImages));

            formState.complements.forEach((complement, index) => {
                formData.append(`complements[${index}][_id]`, complement._id);
                formData.append(`complements[${index}][name]`, complement.name);
                formData.append(`complements[${index}][order]`, String(complement.order));
            })

            await api.post('/edit/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            window.location.reload();
        } catch (err: unknown) {
            setLoading(false)
            console.error("Erro no handleFormState: ", err);
        }
    };
    
    useEffect(() => {
        if (editedProduct) {
            const selectedComplements = editedProduct.complementsGroups || [];

            const mappedComplements =
                categoriesComplements
                    ?.filter((comp) => selectedComplements.includes(comp._id))
                    .map((comp, index) => ({
                        name: comp.title,
                        order: index + 1,
                        _id: comp._id,
                    })) || [];

            const mappedImages =
                editedProduct.sliderHeader?.image?.map((img) => ({
                    photo: img.photo,
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: false,
                })) || [];

            setFormState({
                id: editedProduct?._id || editedProduct?.id || "",
                active: editedProduct?.active,
                name: editedProduct?.name || "",
                description: editedProduct?.description || "",
                slug: editedProduct?.slug || "",
                price: String(editedProduct?.price) || "",
                preparationTime: String(editedProduct?.preparationTime) || "",
                code: editedProduct?.code || "",
                barCode: editedProduct?.barCode || "",
                images: mappedImages,
                period: "",
                complements: mappedComplements,
                branch: editedProduct.branch || ""
            });
        }
    }, [editedProduct, categoriesComplements]);
    
    return (
        <Modal show={show} onClose={onClose}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Editar Produto</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={onClose}
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
                            onClick={() => handleMenuClick('image')}
                            backgroundColor={menuOptions.image ? "black" : "unset"}
                            color={menuOptions.image ? "white" : "black"}
                        >Imagem</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('availability')}
                            backgroundColor={menuOptions.availability ? "black" : "unset"}
                            color={menuOptions.availability ? "white" : "black"}
                        >Disponibilidade</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('complements')}
                            backgroundColor={menuOptions.complements ? "black" : "unset"}
                            color={menuOptions.complements ? "white" : "black"}
                        >Complementos</Button>
                    </Menu>

                    {menuOptions.general &&
                        <General>
                            <GeneralRow1>
                                <Toggle
                                    checked={formState.active}
                                    labelRight={formState.active ? "Ativo" : "Inativo"}
                                    margin="0 7px 0 0"
                                    onChange={() => handleActive(!formState.active)}
                                />

                                <h2></h2>
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
                                <InputWithLabel
                                    label="Slug"
                                    value={formState.slug}
                                    height="70%"
                                    readOnly
                                />
                            </GeneralRow4>

                            <GeneralRow5>
                                <InputWithLabel
                                    label="Preço"
                                    value={formState.price}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'price')}
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
                                    label="Código PDV"
                                    value={formState.code}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'code')}
                                />
                            </GeneralRow7>

                            <GeneralRow8>
                                <InputWithLabel
                                    label="Código de barras"
                                    value={formState.barCode}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'barCode')}
                                />
                            </GeneralRow8>

                            <GeneralRow9>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading />
                                    }
                                </div>
                            </GeneralRow9>
                        </General>
                    }


                    {menuOptions.image && (
                        <Image>
                            <ImageRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para o produto.</Title>
                            </ImageRow1>

                            {formState.images.map((image, index) => (
                                <ImageRow gridArea={`row${index + 2}`} key={index}>
                                    <input type="file" accept="image/*"  className="border border-gray-400 rounded" onChange={(e) => handleImageUpload(e, index)} />

                                    {image.photo && (
                                        <div className="flex flex-row gap-3">
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
                                </ImageRow>
                            ))}

                            <ImageRow5>
                                {!loading
                                    ? <>
                                        {formState.images.length < MAX_IMAGES && (
                                            <Button type="button" onClick={handleAddImageSlot}>
                                                Adicionar Mais Uma Imagem
                                            </Button>
                                        )}

                                        <Button type="submit">Salvar</Button>
                                      </>
                                    : <Loading />
                                }
                            </ImageRow5>
                        </Image>
                    )}

                    {menuOptions.availability &&
                        <Availability>
                            <AvailabilityRow1>
                                <Title>Escolha um período</Title>
                            </AvailabilityRow1>

                            <AvailabilityRow2>
                                <RadioWithLabel
                                    label="Sempre disponível"
                                    name="period"
                                    value="sempre"
                                    checked={formState.period === "sempre"}
                                    onChange={(e) => handleChangeOrder(e, 'period')}
                                />

                                <RadioWithLabel
                                    label="Horário"
                                    name="period"
                                    value="horario"
                                    checked={formState.period === "horario"}
                                    onChange={(e) => handleChangeOrder(e, 'period')}
                                />

                            </AvailabilityRow2>

                            <AvailabilityRow3>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading />
                                    }
                                </div>
                            </AvailabilityRow3>
                        </Availability>
                    }

                    {menuOptions.complements &&
                        <Complements>
                            <ComplementsRow1>
                                <Title>Selecione os grupos de complementos</Title>
                            </ComplementsRow1>

                            <ComplementsRow2>
                                {categoriesComplements?.map((complement) => {
                                    const addon = formState.complements.find((a) => a._id === complement._id);
                                    const orderNumber = addon ? addon.order : null;

                                    return (
                                        <CheckBoxWithLabel
                                            key={complement._id}
                                            label={`${complement.title} ${orderNumber ? `(${orderNumber})` : ""}`}
                                            value={complement._id}
                                            checked={Boolean(addon)}
                                            onChange={(e) => handleChangeOrder(e, "complements")}
                                        />
                                    );
                                })}
                            </ComplementsRow2>

                            <ComplementsRow3>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading />
                                    }
                                </div>
                            </ComplementsRow3>
                        </Complements>
                    }
                </Body>
            </Container>
        </Modal>
    )
}

export default EditProductModal
