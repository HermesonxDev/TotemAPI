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
    ProductImage,
    Others,
    OthersRow1,
    OthersRow2,
    OthersRow3,
    Orders,
    OrdersRow1,
    OrdersRow2,
    OrdersRow3,
    OrdersRow4,
    OrdersRow5,
    OrdersRow6,
    Payment,
    PaymentRow1,
    PaymentRow2,
    PaymentRow3,
    PaymentRow4,
    TotemConfig,
    TotemConfigRow1,
    TotemConfigRow2,
    TotemConfigRow3,
    TotemConfigRow4,
    TotemConfigRow5,
    TotemConfigRow6,
    GeneralConfig,
    GeneralConfigRow1,
    GeneralConfigRow2,
    GeneralConfigRow3,
    GeneralConfigRow4,
    OthersRow4,
    Images,
    ImagesRow1,
    ImagesRow,
    ImagesRow7,
    TotemConfigRow7,
    TotemConfigRow8,
    TotemConfigRow9,
    TotemConfigRow10,
    GeneralConfigRow5,
    GeneralConfigRow6,
    GeneralConfigRow7,
    GeneralConfigRow8,
    GeneralConfigRow9,
    GeneralConfigRow10,
    OthersRow5,
    OthersRow6,
    OthersRow7,
    OthersRow8,
    OthersRow9,
    GeneralConfigRow11
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import {
    CreateCompanyForm,
    CreateCompanyFormOptions,
    Image as ImageInterface
} from "@/utils/interfaces"
import api from "@/Services/api";
import Loading from "../Loading";

interface ICreateCompanyModalProps {
    show: boolean,
    onClose(): void
}

const CreateCompanyModal: React.FC<ICreateCompanyModalProps> = ({ show, onClose }) => {

    const MAX_IMAGES = {
        bannerHeaderImages: 5,
        consumeTypeBackground: 1,
        selectPaymentBackground: 1,
        icon512: 1,
        headerLogo: 1,
        favicon: 1
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const [formState, setFormState] = useState<CreateCompanyForm>({
        active: true,
        name: '',
        slug: '',
        phone: '',
        owner: '',
        prepaidEnabled: false,
        driveThruEnabled: false,
        allowAllBranchesView: false,
        bannerHeaderImages: [],
        hideCategoriesMenu: false,
        isFacebookLoginInactive: false,
        proximityRadiusTakeAwayActive: false,
        proximityRadiusTakeAway: '',
        settingsTotemPaymentLock: false,
        settingsTotemPrimaryColor: '',
        settingsTotemSecundaryColor: '',
        settingsTotemlayout: '',
        settingsScreenTotemOrientation: '',
        columns: '',
        customerNameFormat: '',
        consumeTypeBackground: [],
        selectPaymentBackground: [],
        allowPrinting: false,
        membershipMode: false,
        screenOrientation: '',
        modalFontColor: '',
        selectedMenuFontColor: '',
        paperSize: '',
        printNote: '',
        moneyPaymentText: '',
        whatsAppButton: false,
        whatsAppNumber: '',
        whatsAppVerifier: false,
        defaultWhatsAppMessage: '',
        signUpCardRequired: false,
        currency: '',
        ourStoresText: '',
        driveThruInfo: '',
        onStoreText: '',
        toGoText: '',
        deliveryText: '',
        settingsPrimaryColor: '',
        settingsSecundaryColor: '',
        icon512: [],
        headerLogo: [],
        favicon: [],
        noAuthOrder: false,
        oneSignalAppId: '',
        oneSignalRestApiKey: '',
        appUrl: '',
        layout: '',
        deliveryIndoor: false,
        deliveryIndoorType: '',
        faceRecognition: false,
        sellerSystem: false,
        paymentLock: false
    })

    const [menuOptions, setMenuOptions] = useState<CreateCompanyFormOptions>({
        general: true,
        totemConfig: false,
        generalConfig: false,
        imagesGeneralConfig: false,
        others: false
    })

    const handleMenuClick = (option: keyof CreateCompanyFormOptions) => {
        setMenuOptions({
            general: false,
            totemConfig: false,
            generalConfig: false,
            imagesGeneralConfig: false,
            others: false,
            [option]: true
        })
    }

    const handleToggle = (value: boolean, key: keyof CreateCompanyForm) => {
        setFormState((prev) => ({
            ...prev,
            [key]: value
        }));
    };


    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof CreateCompanyForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {
            if (key === "bannerHeaderImages" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    bannerHeaderImages: [...prev.bannerHeaderImages, ...newImages]
                };
            }

            if (key === "consumeTypeBackground" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    consumeTypeBackground: [...prev.consumeTypeBackground, ...newImages]
                };
            }

            if (key === "selectPaymentBackground" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    selectPaymentBackground: [...prev.selectPaymentBackground, ...newImages]
                };
            }

            if (key === "icon512" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    icon512: [...prev.icon512, ...newImages]
                };
            }

            if (key === "headerLogo" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    headerLogo: [...prev.headerLogo, ...newImages]
                };
            }

            if (key === "favicon" && files) {
                const newImages: ImageInterface[] = Array.from(files).map(file => ({
                    photo: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));

                return {
                    ...prev,
                    favicon: [...prev.favicon, ...newImages]
                };
            }

            const updatedState = { ...prev, [key]: value };

            if (key === "name") {
                updatedState.slug = generateSlug(value);
            }

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
                "bannerHeaderImages",
                "consumeTypeBackground",
                "selectPaymentBackground",
                "icon512",
                "headerLogo",
                "favicon"
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

            await api.post('/create/company', formData, {
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
                name: '',
                slug: '',
                phone: '',
                owner: '',
                prepaidEnabled: false,
                driveThruEnabled: false,
                allowAllBranchesView: false,
                bannerHeaderImages: [],
                hideCategoriesMenu: false,
                isFacebookLoginInactive: false,
                proximityRadiusTakeAwayActive: false,
                proximityRadiusTakeAway: '',
                settingsTotemPaymentLock: false,
                settingsTotemPrimaryColor: '',
                settingsTotemSecundaryColor: '',
                settingsTotemlayout: '',
                settingsScreenTotemOrientation: '',
                columns: '',
                customerNameFormat: '',
                consumeTypeBackground: [],
                selectPaymentBackground: [],
                allowPrinting: false,
                membershipMode: false,
                screenOrientation: '',
                modalFontColor: '',
                selectedMenuFontColor: '',
                paperSize: '',
                printNote: '',
                moneyPaymentText: '',
                whatsAppButton: false,
                whatsAppNumber: '',
                whatsAppVerifier: false,
                defaultWhatsAppMessage: '',
                signUpCardRequired: false,
                currency: '',
                ourStoresText: '',
                driveThruInfo: '',
                onStoreText: '',
                toGoText: '',
                deliveryText: '',
                settingsPrimaryColor: '',
                settingsSecundaryColor: '',
                icon512: [],
                headerLogo: [],
                favicon: [],
                noAuthOrder: false,
                oneSignalAppId: '',
                oneSignalRestApiKey: '',
                appUrl: '',
                layout: '',
                deliveryIndoor: false,
                deliveryIndoorType: '',
                faceRecognition: false,
                sellerSystem: false,
                paymentLock: false
            })
            onClose()
        }
    }

    return (
        <Modal show={show} onClose={closeForm}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Criar Franquia</Title>
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
                            onClick={() => handleMenuClick('totemConfig')}
                            backgroundColor={menuOptions.totemConfig ? "black" : "unset"}
                            color={menuOptions.totemConfig ? "white" : "black"}
                        >Config. Totem</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('generalConfig')}
                            backgroundColor={menuOptions.generalConfig ? "black" : "unset"}
                            color={menuOptions.generalConfig ? "white" : "black"}
                        >Config. Gerais</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('imagesGeneralConfig')}
                            backgroundColor={menuOptions.imagesGeneralConfig ? "black" : "unset"}
                            color={menuOptions.imagesGeneralConfig ? "white" : "black"}
                        >Imagens Config. Gerais (Banner)</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('others')}
                            backgroundColor={menuOptions.others ? "black" : "unset"}
                            color={menuOptions.others ? "white" : "black"}
                        >Outros</Button>
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
                                    label="Slug"
                                    value={formState.slug}
                                    height="70%"
                                    readOnly
                                />
                            </GeneralRow3>

                            <GeneralRow4>
                                <InputWithLabel
                                    label="Número de Telefone"
                                    value={formState.phone}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'phone')}
                                />
                            </GeneralRow4>

                            <GeneralRow5>
                                {/* <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.owner}
                                    onChange={(e) => handleChangeOrder(e, "owner")}
                                >
                                    <option value="" disabled hidden>Dono</option>
                                </select> */}
                            </GeneralRow5>

                            <GeneralRow6>
                                <Toggle
                                    checked={formState.prepaidEnabled}
                                    labelRight="Ativar Pré-Pago"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.prepaidEnabled, "prepaidEnabled")}
                                />

                                <Toggle
                                    checked={formState.driveThruEnabled}
                                    labelRight="Ativar Drive Thru"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.driveThruEnabled, "driveThruEnabled")}
                                />

                                <Toggle
                                    checked={formState.allowAllBranchesView}
                                    labelRight="Permitir que Todas as Franquias Visualizem"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.allowAllBranchesView, "allowAllBranchesView")}
                                />

                                <Toggle
                                    checked={formState.hideCategoriesMenu}
                                    labelRight="Ocultar Menu de Categorias"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.hideCategoriesMenu, "hideCategoriesMenu")}
                                />

                                <Toggle
                                    checked={formState.isFacebookLoginInactive}
                                    labelRight="Desativar Login com Facebook"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.isFacebookLoginInactive, "isFacebookLoginInactive")}
                                />

                                <Toggle
                                    checked={formState.noAuthOrder}
                                    labelRight="Pedido sem Autorização"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.noAuthOrder, "noAuthOrder")}
                                />

                                <Toggle
                                    checked={formState.faceRecognition}
                                    labelRight="Reconhecimento Facial"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.faceRecognition, "faceRecognition")}
                                />

                                <Toggle
                                    checked={formState.paymentLock}
                                    labelRight="Bloquear Pagamento"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.paymentLock, "paymentLock")}
                                />

                                <Toggle
                                    checked={formState.sellerSystem}
                                    labelRight="Sistema de Vendas"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.sellerSystem, "sellerSystem")}
                                />

                                <Toggle
                                    checked={formState.proximityRadiusTakeAwayActive}
                                    labelRight="Ativar Retirada de Pedidos"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.proximityRadiusTakeAwayActive, "proximityRadiusTakeAwayActive")}
                                />
                            </GeneralRow6>

                            <GeneralRow7>
                                {formState.proximityRadiusTakeAwayActive &&
                                    <InputWithLabel
                                        label="Raio de Proximidade para Retirar (Metros)"
                                        value={formState.proximityRadiusTakeAway}
                                        height="70%"
                                        onChange={(e) => handleChangeOrder(e, 'proximityRadiusTakeAway')}
                                    />
                                }
                            </GeneralRow7>

                            <GeneralRow8>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </GeneralRow8>
                        </General>
                    }

                    {menuOptions.totemConfig &&
                        <TotemConfig>
                            <TotemConfigRow1>
                                <InputWithLabel
                                    label="Cor Primaria"
                                    value={formState.settingsTotemPrimaryColor}
                                    type="color"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'settingsTotemPrimaryColor')}
                                />

                                <InputWithLabel
                                    label="Cor Secundaria"
                                    value={formState.settingsTotemSecundaryColor}
                                    type="color"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'settingsTotemSecundaryColor')}
                                />

                                <InputWithLabel
                                    label="Cor Fonte Modal"
                                    value={formState.modalFontColor}
                                    type="color"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'modalFontColor')}
                                />

                                <InputWithLabel
                                    label="Cor Tela Pedidos"
                                    value={formState.selectedMenuFontColor}
                                    type="color"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'selectedMenuFontColor')}
                                />
                            </TotemConfigRow1>

                            <TotemConfigRow2>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.settingsTotemlayout}
                                    onChange={(e) => handleChangeOrder(e, "settingsTotemlayout")}
                                >
                                    <option value="" disabled hidden>Layout</option>
                                    <option value="Transparente" >Transparente</option>
                                    <option value="Card" >Card</option>
                                </select>

                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.columns}
                                    onChange={(e) => handleChangeOrder(e, "columns")}
                                >
                                    <option value="" disabled hidden>Qtd. Colunas</option>
                                    <option value="2" >2</option>
                                    <option value="3" >3</option>
                                </select>
                            </TotemConfigRow2>

                            <TotemConfigRow3>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.customerNameFormat}
                                    onChange={(e) => handleChangeOrder(e, "customerNameFormat")}
                                >
                                    <option value="" disabled hidden>Chamar Cliente</option>
                                    <option value="1" >Pelo Nome</option>
                                    <option value="2" >Pelo Número do Pedido</option>
                                </select>

                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.paperSize}
                                    onChange={(e) => handleChangeOrder(e, "paperSize")}
                                >
                                    <option value="" disabled hidden>Tamanho do Papel</option>
                                    <option value="mm58" >mm58</option>
                                    <option value="mm80" >mm80</option>
                                </select>
                            </TotemConfigRow3>

                            <TotemConfigRow4>
                                <InputWithLabel
                                    label="Mensagem no Final da Impressão"
                                    value={formState.printNote}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'printNote')}
                                />
                            </TotemConfigRow4>

                            <TotemConfigRow5>
                                <InputWithLabel
                                    label="Mensagem Para Pagamento em Dinheiro"
                                    value={formState.moneyPaymentText}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'moneyPaymentText')}
                                />
                            </TotemConfigRow5>

                            <TotemConfigRow6>
                                <Toggle
                                    checked={formState.allowPrinting}
                                    labelRight="Permitir Impressão"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.allowPrinting, "allowPrinting")}
                                />

                                <Toggle
                                    checked={formState.settingsTotemPaymentLock}
                                    labelRight="Bloquear Pagamento"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.settingsTotemPaymentLock, "settingsTotemPaymentLock")}
                                />
                            </TotemConfigRow6>

                            <TotemConfigRow7>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.settingsScreenTotemOrientation}
                                    onChange={(e) => handleChangeOrder(e, "settingsScreenTotemOrientation")}
                                >
                                    <option value="" disabled hidden>Direção da Tela</option>
                                    <option value="landscape" >Retrato</option>
                                    <option value="portrait" >Portátil</option>
                                </select>
                            </TotemConfigRow7>

                            {formState.consumeTypeBackground.map((image, index) => (
                                <TotemConfigRow8>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%] w-full"
                                        onChange={(e) => handleImageUpload(e, "consumeTypeBackground", index)}
                                    />

                                    {image.photo ?
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

                                                <Button type="button" onClick={() => handleRemoveImage("consumeTypeBackground", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                        : <h2>Selecione uma Imagem Para ser o Background do Tipo de Consumo</h2>
                                    }
                                </TotemConfigRow8>
                            ))}

                            {formState.selectPaymentBackground.map((image, index) => (
                                <TotemConfigRow9>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%] w-full"
                                        onChange={(e) => handleImageUpload(e, "selectPaymentBackground", index)}
                                    />

                                    {image.photo ?
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

                                                <Button type="button" onClick={() => handleRemoveImage("selectPaymentBackground", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                        : <h2>Selecione uma Imagem Para ser o Background do Tipo de Pagamento</h2>
                                    }
                                </TotemConfigRow9>
                            ))}

                            <TotemConfigRow10>
                                {!loading
                                    ? <>
                                        {formState.consumeTypeBackground.length < MAX_IMAGES.consumeTypeBackground && (
                                            <Button
                                                type="button"
                                                onClick={() => handleAddImageSlot("consumeTypeBackground")}
                                                fontSize="14px"
                                                padding="3px 6px"
                                            > imagem Tipo de Consumo </Button>
                                        )}

                                        {formState.selectPaymentBackground.length < MAX_IMAGES.selectPaymentBackground && (
                                            <Button
                                                type="button"
                                                onClick={() => handleAddImageSlot("selectPaymentBackground")}
                                                fontSize="14px"
                                                padding="3px 6px"
                                            > imagem Tipo de Pagamento </Button>
                                        )}

                                        <Button type="submit">Salvar</Button>
                                    </>
                                    : <Loading width="50px" />
                                }
                            </TotemConfigRow10>
                        </TotemConfig>
                    }

                    {menuOptions.generalConfig &&
                        <GeneralConfig>
                            <GeneralConfigRow1>
                                <InputWithLabel
                                    label="Cor Primaria"
                                    value={formState.settingsPrimaryColor}
                                    type="color"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'settingsPrimaryColor')}
                                />

                                <InputWithLabel
                                    label="Cor Secundaria"
                                    value={formState.settingsSecundaryColor}
                                    type="color"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'settingsSecundaryColor')}
                                />
                            </GeneralConfigRow1>

                            <GeneralConfigRow2>
                                <InputWithLabel
                                    label="Texto de Retirada na Loja"
                                    value={formState.toGoText}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'toGoText')}
                                />
                            </GeneralConfigRow2>

                            <GeneralConfigRow3>
                                <InputWithLabel
                                    label="Texto de Consumo no Local"
                                    value={formState.onStoreText}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'onStoreText')}
                                />
                            </GeneralConfigRow3>

                            <GeneralConfigRow4>
                                <InputWithLabel
                                    label="Texto para Nossas Lojas"
                                    value={formState.ourStoresText}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'ourStoresText')}
                                />
                            </GeneralConfigRow4>

                            <GeneralConfigRow5>
                                <InputWithLabel
                                    label="Texto para Delivery"
                                    value={formState.deliveryText}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'deliveryText')}
                                />
                            </GeneralConfigRow5>

                            <GeneralConfigRow6>
                                <InputWithLabel
                                    label="Número do Whatsapp"
                                    value={formState.whatsAppNumber}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'whatsAppNumber')}
                                />
                            </GeneralConfigRow6>

                            <GeneralConfigRow7>
                                <InputWithLabel
                                    label="Mensagem Padrão do Whatsapp"
                                    value={formState.defaultWhatsAppMessage}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'defaultWhatsAppMessage')}
                                />
                            </GeneralConfigRow7>

                            <GeneralConfigRow8>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.driveThruInfo}
                                    onChange={(e) => handleChangeOrder(e, "driveThruInfo")}
                                >
                                    <option value="" disabled hidden>Infor. Drive Thru</option>
                                    <option value="Placa/número" >Placa/número</option>
                                    <option value="Serviço de Quarto" >Serviço de Quarto</option>
                                </select>

                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.screenOrientation}
                                    onChange={(e) => handleChangeOrder(e, "screenOrientation")}
                                >
                                    <option value="" disabled hidden>Direção da Tela</option>
                                    <option value="landscape" >Retrato</option>
                                    <option value="portrait" >Portátil</option>
                                </select>
                            </GeneralConfigRow8>

                            <GeneralConfigRow9>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.currency}
                                    onChange={(e) => handleChangeOrder(e, "currency")}
                                >
                                    <option value="" disabled hidden>Moeda</option>
                                    <option value="BRL" >BRL</option>
                                    <option value="USD" >USD</option>
                                    <option value="EUR" >EUR</option>
                                </select>
                            </GeneralConfigRow9>

                            <GeneralConfigRow10>
                                <Toggle
                                    checked={formState.membershipMode}
                                    labelRight="Modo de Adesão"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.membershipMode, "membershipMode")}
                                />

                                <Toggle
                                    checked={formState.whatsAppVerifier}
                                    labelRight="Verificador de Whatsapp"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.whatsAppVerifier, "whatsAppVerifier")}
                                />

                                <Toggle
                                    checked={formState.signUpCardRequired}
                                    labelRight="Cartão de Inscrição Obrigatório"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.signUpCardRequired, "signUpCardRequired")}
                                />

                                <Toggle
                                    checked={formState.paymentLock}
                                    labelRight="Bloquear Pagamento"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.paymentLock, "paymentLock")}
                                />

                                <Toggle
                                    checked={formState.whatsAppButton}
                                    labelRight="Botão de Whatsapp"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.whatsAppButton, "whatsAppButton")}
                                />
                            </GeneralConfigRow10>

                            <GeneralConfigRow11>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </GeneralConfigRow11>
                        </GeneralConfig>
                    }

                    {menuOptions.imagesGeneralConfig &&
                        <Images>
                            <ImagesRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para o Banner.</Title>
                            </ImagesRow1>

                            {formState.bannerHeaderImages.map((image, index) => (
                                <ImagesRow gridArea={`row${index + 2}`} key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%]"
                                        onChange={(e) => handleImageUpload(e, "bannerHeaderImages", index)}
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

                                                <Button type="button" onClick={() => handleRemoveImage("bannerHeaderImages", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </ImagesRow>
                            ))}

                            <ImagesRow7>
                                {!loading
                                    ? <>
                                        {formState.bannerHeaderImages.length < MAX_IMAGES.bannerHeaderImages && (
                                            <Button type="button" onClick={() => handleAddImageSlot("bannerHeaderImages")}>
                                                Adicionar Mais Uma Imagem
                                            </Button>
                                        )}

                                        <Button type="submit">Salvar</Button>
                                        </>
                                    : <Loading width="50px" />
                                }
                            </ImagesRow7>
                        </Images>
                    }

                    {menuOptions.others &&
                        <Others>
                            <OthersRow1>
                                <InputWithLabel
                                    label="OneSignal App ID"
                                    value={formState.oneSignalAppId}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'oneSignalAppId')}
                                />
                            </OthersRow1>

                            <OthersRow2>
                                <InputWithLabel
                                    label="OneSignal Rest Api Key"
                                    value={formState.oneSignalRestApiKey}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'oneSignalRestApiKey')}
                                />
                            </OthersRow2>

                            <OthersRow3>
                                <InputWithLabel
                                    label="App URL"
                                    value={formState.appUrl}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'appUrl')}
                                />
                            </OthersRow3>

                            <OthersRow4>
                                <select
                                    className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                    value={formState.layout}
                                    onChange={(e) => handleChangeOrder(e, "layout")}
                                >
                                    <option value="" disabled hidden>Layout</option>
                                    <option value="Grid" >Grid</option>
                                    <option value="Lista" >Lista</option>
                                </select>
                            </OthersRow4>

                            <OthersRow5>
                                <Toggle
                                    checked={formState.deliveryIndoor}
                                    labelRight="Entrega Interior"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.deliveryIndoor, "deliveryIndoor")}
                                />

                                {formState.deliveryIndoor &&
                                    <select
                                        className="w-[55%] rounded-md border-gray-300 text-gray-700"
                                        value={formState.deliveryIndoorType}
                                        onChange={(e) => handleChangeOrder(e, "deliveryIndoorType")}
                                    >
                                        <option value="" disabled hidden>Tipo de Usuário da Entrega Interna</option>
                                        <option value="Hospede" >Hospede</option>
                                    </select>
                                }
                            </OthersRow5>

                            {formState.icon512.map((image, index) => (
                                <OthersRow6 key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%] w-[100%]"
                                        onChange={(e) => handleImageUpload(e, "icon512", index)}
                                    />

                                    {image.photo ?
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

                                                <Button type="button" onClick={() => handleRemoveImage("selectPaymentBackground", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                        : <h2>Selecione uma Imagem Para ser o Icone de tamanho 512x512</h2>
                                    }
                                </OthersRow6>
                            ))}

                            {formState.headerLogo.map((image, index) => (
                                <OthersRow7 key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%] w-[100%]"
                                        onChange={(e) => handleImageUpload(e, "headerLogo", index)}
                                    />

                                    {image.photo ?
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

                                                <Button type="button" onClick={() => handleRemoveImage("selectPaymentBackground", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                        : <h2>Selecione uma Imagem Para ser o Logo</h2>
                                    }
                                </OthersRow7>
                            ))}

                            {formState.favicon.map((image, index) => (
                                <OthersRow8 key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%] w-[100%]"
                                        onChange={(e) => handleImageUpload(e, "favicon", index)}
                                    />

                                    {image.photo ?
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

                                                <Button type="button" onClick={() => handleRemoveImage("selectPaymentBackground", index)}>
                                                    Remover
                                                </Button>
                                            </div>
                                        </div>
                                        : <h2>Selecione uma Imagem Para ser o Favicon</h2>
                                    }
                                </OthersRow8>
                            ))}

                            <OthersRow9>
                                {!loading
                                    ? <>
                                        {formState.icon512.length < MAX_IMAGES.icon512 && (
                                            <Button
                                                type="button"
                                                onClick={() => handleAddImageSlot("icon512")}
                                                fontSize="14px"
                                                padding="3px 6px"
                                            > Add Icone 512x512 </Button>
                                        )}

                                        {formState.headerLogo.length < MAX_IMAGES.headerLogo && (
                                            <Button
                                                type="button"
                                                onClick={() => handleAddImageSlot("headerLogo")}
                                                fontSize="14px"
                                                padding="3px 6px"
                                            > Add Logo </Button>
                                        )}

                                        {formState.favicon.length < MAX_IMAGES.favicon && (
                                            <Button
                                                type="button"
                                                onClick={() => handleAddImageSlot("favicon")}
                                                fontSize="14px"
                                                padding="3px 6px"
                                            > Add Favicon </Button>
                                        )}

                                        <Button type="submit">Salvar</Button>
                                    </>
                                    : <Loading width="50px" />
                                }
                            </OthersRow9>
                        </Others>
                    }
                </Body>
            </Container>
        </Modal>
    )
}

export default CreateCompanyModal
