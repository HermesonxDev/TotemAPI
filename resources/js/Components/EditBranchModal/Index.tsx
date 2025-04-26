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
    Printing,
    GeneralRow9,
    PrintingRow1,
    PrintingRow2,
    PrintingRow3,
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
    GeneralRow10,
    GeneralRow11,
    TotemConfig,
    TotemConfigRow1,
    TotemConfigRow2,
    TotemConfigRow3,
    TotemConfigRow4,
    TotemConfigRow5,
    TotemConfigRow6,
    AppConfig,
    AppConfigRow1,
    AppConfigRow2,
    AppConfigRow3,
    AppConfigRow4,
    PrintingRow4,
    GeneralRow12,
    Images,
    ImagesRow1,
    ImagesRow,
    ImagesRow7,
    TotemConfigRow7,
} from "./styles"

import Toggle from "../Toggle"
import InputWithLabel from "../InputWithLabel"
import {
    Branch,
    Company,
    CreateBranchForm,
    CreateBranchFormOptions,
    Image as ImageInterface
} from "@/utils/interfaces"
import api from "@/Services/api";
import Loading from "../Loading";

interface IEditBranchModalProps {
    show: boolean,
    editedBranch: Branch,
    onClose(): void
}

const EditBranchModal: React.FC<IEditBranchModalProps> = ({ show, editedBranch, onClose }) => {

    const { props } = usePage()
    const company = props.company as Company

    const MAX_IMAGES = {
        splashTotemImages: 5,
        bannerHeaderTotemImages: 5,
        bannerHeaderWebImages: 5,
        bannerHeaderAppImages: 5,
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [saveData, setSaveData] = useState<boolean>(false)

    const [formState, setFormState] = useState<CreateBranchForm>({
        id: '',
        active: true,
        name: '',
        slug: '',
        phone: '',
        whatsappPhone: '',
        email: '',
        franchise: company?.id,
        street: '',
        neighborhood: '',
        complement: '',
        number: '',
        cep: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        storeInfo: '',
        adminPassword: '',
        serialNumber: '',
        controllerID: '',
        plugPagActivationKey: '',
        openFreezerBtn: false,
        activeMicroMarket: false,
        askForClientCPF: false,
        askForClientPassword: false,
        askForClientPhone: false,
        allowPrinting: false,
        paymentLock: false,
        memberShipMode: false,
        allowDelivery: false,
        whatsappBtn: false,
        whatsappMessage: '',
        splashTotemImages: [],
        bannerHeaderTotemImages: [],
        bannerHeaderWebImages: [],
        bannerHeaderAppImages: [],
        automaticPrinting: false,
        normalizePrinting: false,
        htmlPrinting: false,
        isOnlinePaymentDisabled: false,
        quantityPrintingCopies: '',
        quantityPrintingColumns: '',
        serviceFee: '',
        minPrice: '',
        useMinPriceOnDelivery: false,
        schedulingOrders: false,
        minQuantitySO: '',
        maxQuantitySO: '',
        takeAwayOrders: false,
        minQuantityTAO: '',
        maxQuantityTAO: '',
        money: false,
        online: false,
        pix: false,
        pixDestinatary: '',
        pixKey: '',
        pixType: '',
    })

    // const [formState, setFormState] = useState<CreateBranchForm>({
    //     active: true,
    //     name: "Unidade Teste",
    //     slug: "unidade-teste",
    //     phone: "85999247660",
    //     whatsappPhone: "85999247660",
    //     email: "hermesonsantos@berp.com.br",
    //     franchise: "6441ae9a491d9eca5be7d146",
    //     street: "Aveledo",
    //     neighborhood: "Messejana",
    //     complement: "Muro Rosa",
    //     number: "669",
    //     cep: "60871-210",
    //     city: "Fortaleza",
    //     state: "Ceará",
    //     latitude: "-3.8362731",
    //     longitude: "-38.5005203",
    //     storeInfo: "Essa Loja é de fachada, na verdade eu lavo dinheiro nela",
    //     adminPassword: "@@Rqqo231i",
    //     serialNumber: "f97a4cb4-6f2d-4a9b-bf9d-9fc2f1e7dc1f",
    //     controllerID: "1",
    //     plugPagActivationKey: "545635776",
    //     openFreezerBtn: true,
    //     activeMicroMarket: true,
    //     askForClientCPF: true,
    //     askForClientPassword: true,
    //     askForClientPhone: true,
    //     allowPrinting: true,
    //     paymentLock: true,
    //     memberShipMode: true,
    //     allowDelivery: true,
    //     whatsappBtn: true,
    //     whatsappMessage: "Oi, tu quer comprar o que?",
    //     splashTotemImages: [],
    //     bannerHeaderTotemImages: [],
    //     bannerHeaderWebImages: [],
    //     bannerHeaderAppImages: [],
    //     automaticPrinting: true,
    //     normalizePrinting: true,
    //     htmlPrinting: true,
    //     isOnlinePaymentDisabled: true,
    //     quantityPrintingCopies: "2",
    //     quantityPrintingColumns: "40",
    //     serviceFee: "10",
    //     minPrice: "100",
    //     useMinPriceOnDelivery: true,
    //     schedulingOrders: true,
    //     minQuantitySO: "10",
    //     maxQuantitySO: "20",
    //     takeAwayOrders: true,
    //     minQuantityTAO: "10",
    //     maxQuantityTAO: "20",
    //     money: true,
    //     online: true,
    //     pix: true,
    //     pixDestinatary: "Eu",
    //     pixKey: "manda-ai-@rrombado",
    //     pixType: "static"
    // })

    const [menuOptions, setMenuOptions] = useState<CreateBranchFormOptions>({
        general: true,
        totemConfig: false,
        splashTotemImages: false,
        bannerHeaderTotemImages: false,
        appConfig: false,
        bannerHeaderAppImages: false,
        bannerHeaderWebImages: false,
        printing: false,
        orders: false,
        payments: false
    })

    const handleMenuClick = (option: keyof CreateBranchFormOptions) => {
        setMenuOptions({
            general: false,
            totemConfig: false,
            splashTotemImages: false,
            bannerHeaderTotemImages: false,
            appConfig: false,
            bannerHeaderAppImages: false,
            bannerHeaderWebImages: false,
            printing: false,
            orders: false,
            payments: false,
            [option]: true
        })
    }

    const handleToggle = (value: boolean, key: keyof CreateBranchForm) => {
        setFormState((prev) => ({
            ...prev,
            [key]: value
        }));
    };


    const handleChangeOrder = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        key: keyof CreateBranchForm
    ) => {
        const { value, checked, files } = event.target as HTMLInputElement;

        setFormState((prev) => {
            if (files && key === "splashTotemImages") {
                const newImages = Array.from(files).map(file => ({
                    photo: file,
                    preview: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));
            
                return {
                    ...prev,
                    splashTotemImages: [...prev.splashTotemImages, ...newImages],
                };
            }            

            if (files && key === "bannerHeaderTotemImages") {
                const newImages = Array.from(files).map(file => ({
                    photo: file,
                    preview: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));
            
                return {
                    ...prev,
                    bannerHeaderTotemImages: [...prev.bannerHeaderTotemImages, ...newImages],
                };
            }

            if (files && key === "bannerHeaderWebImages") {
                const newImages = Array.from(files).map(file => ({
                    photo: file,
                    preview: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));
            
                return {
                    ...prev,
                    bannerHeaderWebImages: [...prev.bannerHeaderWebImages, ...newImages],
                };
            }

            if (files && key === "bannerHeaderAppImages") {
                const newImages = Array.from(files).map(file => ({
                    photo: file,
                    preview: URL.createObjectURL(file),
                    preferredType: "photo",
                    _id: new ObjectId().toString(),
                    active: true,
                    isNew: true,
                }));
            
                return {
                    ...prev,
                    bannerHeaderAppImages: [...prev.bannerHeaderAppImages, ...newImages],
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
                "splashTotemImages",
                "bannerHeaderTotemImages",
                "bannerHeaderWebImages",
                "bannerHeaderAppImages"
            ] as const;

            for (const field of imageFields) {
                const images = formState[field];

                for (const [index, image] of images.entries()) {
                    if (image.isNew) {
                        if (image.photo instanceof File) {
                            formData.append(`${field}[]`, image.photo, image.photo.name);
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

            const existingSplashTotemImages = formState.splashTotemImages
                .filter(image => !image.isNew)
                .map(image => image.photo)

            const existingBannerHeaderTotemImages = formState.bannerHeaderTotemImages
                .filter(image => !image.isNew)
                .map(image => image.photo)

            const existingBannerHeaderWebImages = formState.bannerHeaderWebImages
                .filter(image => !image.isNew)
                .map(image => image.photo)

            const existingBannerHeaderAppImages = formState.bannerHeaderAppImages
                .filter(image => !image.isNew)
                .map(image => image.photo)

            formData.append("existingSplashTotemImages", JSON.stringify(existingSplashTotemImages));
            formData.append("existingBannerHeaderTotemImages", JSON.stringify(existingBannerHeaderTotemImages));
            formData.append("existingBannerHeaderWebImages", JSON.stringify(existingBannerHeaderWebImages));
            formData.append("existingBannerHeaderAppImages", JSON.stringify(existingBannerHeaderAppImages));

            await api.post('/edit/branch', formData, {
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

    useEffect(() => {
        if(editedBranch) {

            const splashTotemImages = editedBranch.settingsTotem.splash?.image?.map((img) => ({
                photo: img.photo,
                _id: new ObjectId().toString(),
                active: true,
                isNew: false
            })) || []

            const bannerHeaderTotemImages = editedBranch.settingsTotem.bannerHeader?.image?.map((img) => ({
                photo: img.photo,
                _id: new ObjectId().toString(),
                active: true,
                isNew: false
            })) || []

            const bannerHeaderWebImages = editedBranch.settingsWeb.bannerHeader?.image?.map((img) => ({
                photo: img.photo,
                _id: new ObjectId().toString(),
                active: true,
                isNew: false
            })) || []

            const bannerHeaderAppImages = editedBranch.settingsApp.bannerHeader?.image?.map((img) => ({
                photo: img.photo,
                _id: new ObjectId().toString(),
                active: true,
                isNew: false
            })) || []

            setFormState({
                id: editedBranch.id,
                active: editedBranch.active || true,
                name: editedBranch.name || '',
                slug: editedBranch.slug || '',
                phone: editedBranch.phone || '',
                whatsappPhone: editedBranch.settingsApp.whatsAppNumber || '',
                email: editedBranch.contactEmail || '',
                franchise: editedBranch.company,
                street: editedBranch.location.address.street || '',
                neighborhood: editedBranch.location.address.neighborhood || '',
                complement: editedBranch.location.address?.complement || '',
                number: editedBranch.location.address.number || '',
                cep: editedBranch.location.address.postalCode || '',
                city: editedBranch.location.address.city || '',
                state: editedBranch.location.address.state || '',
                latitude: String(editedBranch.location.coordinates[0]) || '',
                longitude: String(editedBranch.location.coordinates[1]) || '',
                storeInfo: editedBranch.storeInfo || '',
                adminPassword: editedBranch.settingsTotem.totemAdminPassword?.password || '',
                serialNumber: editedBranch.settingsTotem.totemSerialNumber || '',
                controllerID: editedBranch.settingsTotem.controllerId || '',
                plugPagActivationKey: editedBranch.settingsTotem.plugPagActivationKey || '',
                openFreezerBtn: editedBranch.settingsTotem.totemOpenFreezerBtn || false,
                activeMicroMarket: editedBranch.settingsTotem.enableMicroMarket || false,
                askForClientCPF: editedBranch.settingsTotem.askforCPF || false,
                askForClientPassword: editedBranch.settingsTotem.askforClientsPassword || false,
                askForClientPhone: editedBranch.settingsTotem.askforPhone || false,
                allowPrinting: editedBranch.settingsTotem.allowPrinting || false,
                paymentLock: editedBranch.settingsTotem.paymentLock || false,
                memberShipMode: editedBranch.settingsTotem.memberShipMode || false,
                allowDelivery: editedBranch.settingsTotem.allowDelivery || false,
                whatsappBtn: editedBranch.settingsApp.whatsAppButton || false,
                whatsappMessage: editedBranch.settingsApp.defaultWhatsAppMessage,
                splashTotemImages: splashTotemImages,
                bannerHeaderTotemImages: bannerHeaderTotemImages,
                bannerHeaderWebImages: bannerHeaderWebImages,
                bannerHeaderAppImages: bannerHeaderAppImages,
                automaticPrinting: editedBranch.automaticPrinting || false,
                normalizePrinting: editedBranch.normalizePrinting || false,
                htmlPrinting: editedBranch.printHtml || false,
                isOnlinePaymentDisabled: editedBranch.isOnlinePaymentDisabled || false,
                quantityPrintingCopies: String(editedBranch.copiesPrinting) || '',
                quantityPrintingColumns: String(editedBranch.printerColumnSize) || '',
                serviceFee: String(editedBranch.serviceFee) || '',
                minPrice: String(editedBranch.minPrice) || '',
                useMinPriceOnDelivery: editedBranch.isDeliveryOnMinPrice || false,
                schedulingOrders: editedBranch.scheduling.active || false,
                minQuantitySO: String(editedBranch.scheduling.min) || '',
                maxQuantitySO: String(editedBranch.scheduling.max) || '',
                takeAwayOrders: editedBranch.takeAway.active || false,
                minQuantityTAO: String(editedBranch.takeAway.min) || '',
                maxQuantityTAO: String(editedBranch.takeAway.max) || '',
                money: editedBranch.paymentMethodsDefault.money.active || false,
                online: editedBranch.paymentMethodsDefault.online.active || false,
                pix: editedBranch.paymentMethodsDefault.pix.active || false,
                pixDestinatary: editedBranch.paymentMethodsDefault.pix.receiverName || '',
                pixKey: editedBranch.paymentMethodsDefault.pix.key || '',
                pixType: editedBranch.paymentMethodsDefault.pix.type || '',
            })
        }
    }, [])

    return (
        <Modal show={show} onClose={onClose}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Editar Unidade</Title>
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
                            onClick={() => handleMenuClick('totemConfig')}
                            backgroundColor={menuOptions.totemConfig ? "black" : "unset"}
                            color={menuOptions.totemConfig ? "white" : "black"}
                        >Config. Totem</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('appConfig')}
                            backgroundColor={menuOptions.appConfig ? "black" : "unset"}
                            color={menuOptions.appConfig ? "white" : "black"}
                        >Config. App</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('splashTotemImages')}
                            backgroundColor={menuOptions.splashTotemImages ? "black" : "unset"}
                            color={menuOptions.splashTotemImages ? "white" : "black"}
                        >Imagens Totem (Splash)</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('bannerHeaderTotemImages')}
                            backgroundColor={menuOptions.bannerHeaderTotemImages ? "black" : "unset"}
                            color={menuOptions.bannerHeaderTotemImages ? "white" : "black"}
                        >Imagens Totem (Banner)</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('bannerHeaderWebImages')}
                            backgroundColor={menuOptions.bannerHeaderWebImages ? "black" : "unset"}
                            color={menuOptions.bannerHeaderWebImages ? "white" : "black"}
                        >Imagens Web (Banner)</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('bannerHeaderAppImages')}
                            backgroundColor={menuOptions.bannerHeaderAppImages ? "black" : "unset"}
                            color={menuOptions.bannerHeaderAppImages ? "white" : "black"}
                        >Imagens App (Banner)</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('printing')}
                            backgroundColor={menuOptions.printing ? "black" : "unset"}
                            color={menuOptions.printing ? "white" : "black"}
                        >Impressão</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('orders')}
                            backgroundColor={menuOptions.orders ? "black" : "unset"}
                            color={menuOptions.orders ? "white" : "black"}
                        >Pedidos</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('payments')}
                            backgroundColor={menuOptions.payments ? "black" : "unset"}
                            color={menuOptions.payments ? "white" : "black"}
                        >F. Pagamentos</Button>
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

                                <div className="flex items-center gap-1"></div>
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

                                <InputWithLabel
                                    label="Número do Whatsapp"
                                    value={formState.whatsappPhone}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'whatsappPhone')}
                                />
                            </GeneralRow4>

                            <GeneralRow5>
                                <InputWithLabel
                                    label="Email de Contato"
                                    value={formState.email}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'email')}
                                />
                            </GeneralRow5>

                            <GeneralRow6>
                                <InputWithLabel
                                    label="Rua"
                                    value={formState.street}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'street')}
                                />
                            </GeneralRow6>

                            <GeneralRow7>
                                <InputWithLabel
                                    label="Bairro"
                                    value={formState.neighborhood}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'neighborhood')}
                                />
                            </GeneralRow7>

                            <GeneralRow8>
                                <InputWithLabel
                                    label="Complemento"
                                    value={formState.complement}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'complement')}
                                />
                            </GeneralRow8>

                            <GeneralRow9>
                                <InputWithLabel
                                    label="Número"
                                    value={formState.number}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'number')}
                                />

                                <InputWithLabel
                                    label="Cep"
                                    value={formState.cep}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'cep')}
                                />
                            </GeneralRow9>

                            <GeneralRow10>
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
                            </GeneralRow10>

                            <GeneralRow11>
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
                    }

                    {menuOptions.totemConfig &&
                        <TotemConfig>
                            <TotemConfigRow1>
                                <InputWithLabel
                                    label="Senha Admin"
                                    value={formState.adminPassword}
                                    type="password"
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'adminPassword')}
                                />
                            </TotemConfigRow1>

                            <TotemConfigRow2>
                                <InputWithLabel
                                    label="Número de Serie"
                                    value={formState.serialNumber}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'serialNumber')}
                                />
                            </TotemConfigRow2>

                            <TotemConfigRow3>
                                <InputWithLabel
                                    label="ID do Controlador"
                                    value={formState.controllerID}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'controllerID')}
                                />
                            </TotemConfigRow3>

                            <TotemConfigRow4>
                                <InputWithLabel
                                    label="Chave de Ativação PlugPag"
                                    value={formState.plugPagActivationKey}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'plugPagActivationKey')}
                                />
                            </TotemConfigRow4>

                            <TotemConfigRow5>
                                <InputWithLabel
                                    label="Informações Adicionais da Loja"
                                    value={formState.storeInfo}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'storeInfo')}
                                />
                            </TotemConfigRow5>

                            <TotemConfigRow6>
                                <Toggle
                                    checked={formState.openFreezerBtn}
                                    labelRight="Botão Para Abrir Freezer"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.openFreezerBtn, "openFreezerBtn")}
                                />

                                <Toggle
                                    checked={formState.activeMicroMarket}
                                    labelRight="Ativar MicroMarket"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.activeMicroMarket, "activeMicroMarket")}
                                />

                                <Toggle
                                    checked={formState.askForClientCPF}
                                    labelRight="Pedir CPF do Cliente"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.askForClientCPF, "askForClientCPF")}
                                />

                                <Toggle
                                    checked={formState.askForClientPassword}
                                    labelRight="Pedir Senha do Cliente"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.askForClientPassword, "askForClientPassword")}
                                />

                                <Toggle
                                    checked={formState.askForClientPhone}
                                    labelRight="Pedir Telefone do Cliente"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.askForClientPhone, "askForClientPhone")}
                                />

                                <Toggle
                                    checked={formState.allowPrinting}
                                    labelRight="Permitir Impressão"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.allowPrinting, "allowPrinting")}
                                />

                                <Toggle
                                    checked={formState.paymentLock}
                                    labelRight="Bloquear Pagamento"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.paymentLock, "paymentLock")}
                                />

                                <Toggle
                                    checked={formState.memberShipMode}
                                    labelRight="Modo de Adesão"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.memberShipMode, "memberShipMode")}
                                />

                                <Toggle
                                    checked={formState.allowDelivery}
                                    labelRight="Permitir Delivery"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.allowDelivery, "allowDelivery")}
                                />

                                <Toggle
                                    checked={formState.isOnlinePaymentDisabled}
                                    labelRight="Permitir Pagamento Online no Delivery"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.isOnlinePaymentDisabled, "isOnlinePaymentDisabled")}
                                />
                            </TotemConfigRow6>

                            <TotemConfigRow7>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </TotemConfigRow7>
                        </TotemConfig>
                    }

                    {menuOptions.appConfig &&
                        <AppConfig>
                            <AppConfigRow1>
                                <Toggle
                                    checked={formState.whatsappBtn}
                                    labelRight="Botão de Whatsapp"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.whatsappBtn, "whatsappBtn")}
                                />
                            </AppConfigRow1>

                            <AppConfigRow2>
                                <InputWithLabel
                                    label="Número do Whatsapp"
                                    value={formState.whatsappPhone}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'whatsappPhone')}
                                />
                            </AppConfigRow2>

                            <AppConfigRow3>
                                <InputWithLabel
                                    label="Mensagem Padrão do Whatsapp"
                                    value={formState.whatsappMessage}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'whatsappMessage')}
                                />
                            </AppConfigRow3>

                            <AppConfigRow4>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </AppConfigRow4>
                        </AppConfig>
                    }

                    {menuOptions.splashTotemImages &&
                        <Images>
                            <ImagesRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para o Produto.</Title>
                            </ImagesRow1>

                            {formState.splashTotemImages.map((image, index) => (
                                <ImagesRow gridArea={`row${index + 2}`} key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%]"
                                        onChange={(e) => handleImageUpload(e, "splashTotemImages", index)}
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

                                                <Button type="button" onClick={() => handleRemoveImage("splashTotemImages", index)}>
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
                                        {formState.splashTotemImages.length < MAX_IMAGES.splashTotemImages && (
                                            <Button type="button" onClick={() => handleAddImageSlot("splashTotemImages")}>
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

                    {menuOptions.bannerHeaderTotemImages &&
                        <Images>
                            <ImagesRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para o Banner.</Title>
                            </ImagesRow1>

                            {formState.bannerHeaderTotemImages.map((image, index) => (
                                <ImagesRow gridArea={`row${index + 2}`} key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%]"
                                        onChange={(e) => handleImageUpload(e, "bannerHeaderTotemImages", index)}
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

                                                <Button type="button" onClick={() => handleRemoveImage("bannerHeaderTotemImages", index)}>
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
                                        {formState.bannerHeaderTotemImages.length < MAX_IMAGES.bannerHeaderTotemImages && (
                                            <Button type="button" onClick={() => handleAddImageSlot("bannerHeaderTotemImages")}>
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

                    {menuOptions.bannerHeaderWebImages &&
                        <Images>
                            <ImagesRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para o Banner.</Title>
                            </ImagesRow1>

                            {formState.bannerHeaderWebImages.map((image, index) => (
                                <ImagesRow gridArea={`row${index + 2}`} key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%]"
                                        onChange={(e) => handleImageUpload(e, "bannerHeaderWebImages", index)}
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

                                                <Button type="button" onClick={() => handleRemoveImage("bannerHeaderWebImages", index)}>
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
                                        {formState.bannerHeaderWebImages.length < MAX_IMAGES.bannerHeaderWebImages && (
                                            <Button type="button" onClick={() => handleAddImageSlot("bannerHeaderWebImages")}>
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

                    {menuOptions.bannerHeaderAppImages &&
                        <Images>
                            <ImagesRow1>
                                <Title>Adicione uma imagem (300KB - 3MB) para o Banner.</Title>
                            </ImagesRow1>

                            {formState.bannerHeaderAppImages.map((image, index) => (
                                <ImagesRow gridArea={`row${index + 2}`} key={index}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-400 rounded h-[20%]"
                                        onChange={(e) => handleImageUpload(e, "bannerHeaderAppImages", index)}
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

                                                <Button type="button" onClick={() => handleRemoveImage("bannerHeaderAppImages", index)}>
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
                                        {formState.bannerHeaderAppImages.length < MAX_IMAGES.bannerHeaderAppImages && (
                                            <Button type="button" onClick={() => handleAddImageSlot("bannerHeaderAppImages")}>
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

                    {menuOptions.printing &&
                        <Printing>
                            <PrintingRow1>
                                <Toggle
                                    checked={formState.automaticPrinting}
                                    labelRight="Impressão Automática"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.automaticPrinting, "automaticPrinting")}
                                />

                                <Toggle
                                    checked={formState.normalizePrinting}
                                    labelRight="Normalizar Impressão"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.normalizePrinting, "normalizePrinting")}
                                />

                                <Toggle
                                    checked={formState.htmlPrinting}
                                    labelRight="Imprimir HTML"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.htmlPrinting, "htmlPrinting")}
                                />
                            </PrintingRow1>

                            <PrintingRow2>
                                <InputWithLabel
                                    label="Qtd. de Copias da Impressão"
                                    value={formState.quantityPrintingCopies}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'quantityPrintingCopies')}
                                />
                            </PrintingRow2>

                            <PrintingRow3>
                                <InputWithLabel
                                    label="Qtd. de Colunas da Impressão"
                                    value={formState.quantityPrintingColumns}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'quantityPrintingColumns')}
                                />
                            </PrintingRow3>

                            <PrintingRow4>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </PrintingRow4>
                        </Printing>
                    }

                    {menuOptions.orders &&
                        <Orders>
                            <OrdersRow1>
                                <InputWithLabel
                                    label="Taxa de Serviço (%)"
                                    value={formState.serviceFee}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'serviceFee')}
                                />
                            </OrdersRow1>

                            <OrdersRow2>
                                <InputWithLabel
                                    label="Preço Mínimo"
                                    value={formState.minPrice}
                                    height="70%"
                                    onChange={(e) => handleChangeOrder(e, 'minPrice')}
                                />
                            </OrdersRow2>

                            <OrdersRow3>
                                <Toggle
                                    checked={formState.useMinPriceOnDelivery}
                                    labelRight="Usar Preço Mínimo no Delivery"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.useMinPriceOnDelivery, "useMinPriceOnDelivery")}
                                />
                            </OrdersRow3>

                            <OrdersRow4>
                                <Toggle
                                    checked={formState.schedulingOrders}
                                    labelRight="Agendamento de Pedidos"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.schedulingOrders, "schedulingOrders")}
                                />

                                {formState.schedulingOrders &&
                                    <div className="flex flex-row gap-[5px]">
                                        <InputWithLabel
                                            label="Qtd. Mínima"
                                            value={formState.minQuantitySO}
                                            height="70%"
                                            onChange={(e) => handleChangeOrder(e, 'minQuantitySO')}
                                        />

                                        <InputWithLabel
                                            label="Qtd. Máxima"
                                            value={formState.maxQuantitySO}
                                            height="70%"
                                            onChange={(e) => handleChangeOrder(e, 'maxQuantitySO')}
                                        />
                                    </div>
                                }
                            </OrdersRow4>

                            <OrdersRow5>
                                <Toggle
                                    checked={formState.takeAwayOrders}
                                    labelRight="Retirada de Pedidos"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.takeAwayOrders, "takeAwayOrders")}
                                />

                                {formState.takeAwayOrders &&
                                    <div className="flex flex-row gap-[5px]">
                                        <InputWithLabel
                                            label="Qtd. Mínima"
                                            value={formState.minQuantityTAO}
                                            height="70%"
                                            onChange={(e) => handleChangeOrder(e, 'minQuantityTAO')}
                                        />

                                        <InputWithLabel
                                            label="Qtd. Máxima"
                                            value={formState.maxQuantityTAO}
                                            height="70%"
                                            onChange={(e) => handleChangeOrder(e, 'maxQuantityTAO')}
                                        />
                                    </div>
                                }
                            </OrdersRow5>

                            <OrdersRow6>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </OrdersRow6>
                        </Orders>
                    }

                    {menuOptions.payments &&
                        <Payment>
                            <PaymentRow1>
                                <Toggle
                                    checked={formState.money}
                                    labelRight="Dinheiro"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.money, "money")}
                                />

                                <Toggle
                                    checked={formState.online}
                                    labelRight="Online"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.online, "online")}
                                />

                                <Toggle
                                    checked={formState.pix}
                                    labelRight="Pix"
                                    margin="0 7px 0 0"
                                    onChange={() => handleToggle(!formState.pix, "pix")}
                                />
                            </PaymentRow1>

                            <PaymentRow2>
                                {formState.pix &&
                                    <>
                                        <InputWithLabel
                                            label="Destinatário"
                                            value={formState.pixDestinatary}
                                            height="70%"
                                            onChange={(e) => handleChangeOrder(e, 'pixDestinatary')}
                                        />

                                        <InputWithLabel
                                            label="Chave"
                                            value={formState.pixKey}
                                            height="70%"
                                            onChange={(e) => handleChangeOrder(e, 'pixKey')}
                                        />
                                    </>
                                }
                            </PaymentRow2>

                            <PaymentRow3>
                                {formState.pix &&
                                    <select
                                        className="w-full h-[63%] rounded-md border-gray-300 text-gray-700"
                                        value={formState.pixType}
                                        onChange={(e) => handleChangeOrder(e, "pixType")}
                                    >
                                        <option
                                            value=""
                                            disabled
                                            hidden
                                        >Tipo</option>

                                        <option value="dinamyc">Dinâmico</option>
                                        <option value="static">Estático</option>
                                    </select>
                                }
                            </PaymentRow3>

                            <PaymentRow4>
                                <div className="absolute bottom-0 right-0">
                                    {!loading
                                        ? <Button type="submit">Salvar</Button>
                                        : <Loading width="50px" />
                                    }
                                </div>
                            </PaymentRow4>
                        </Payment>
                    }
                </Body>
            </Container>
        </Modal>
    )
}

export default EditBranchModal
