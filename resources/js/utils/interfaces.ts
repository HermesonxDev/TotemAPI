/* ############################################################################# */
/* ################################## User ##################################### */
/* ############################################################################# */
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    branches: string[];
    companies: string[];
}


export interface INotificationContent{
    title: string,
    message: string
}

export interface Loadings {
    [id: string]: {
        category?: string,
        complementGroup?: string,
        status?: string,
        soldOut?: string
    }
}
/* ############################################################################# */
/* ################################ Branches ################################### */
/* ############################################################################# */
export interface Branch {
    updatedAt: string,
    createdAt: string,
    name: string,
    phone: string,
    company: string,
    barcodeReader: boolean,
    facebook: BranchFacebook,
    storeInfo: string | null,
    gateways: BranchGateway,
    takeAway: BranchTakeAway,
    settingsTotem: BranchSettingsTotem,
    settingsWeb: BranchSettingsWeb,
    settingsApp: BranchSettingsApp,
    serviceFee: number,
    scheduling: BranchScheduling,
    printHtml: boolean,
    printers: any[],
    printerColumnSize: number,
    preferredOnlineMethod: string,
    paymentMethodsDefault: PaymentMethodsDefault,
    paymentMethods: any[],
    opened: boolean,
    normalizePrinting: boolean,
    minPrice: number,
    locationTypes: number[],
    location: BranchLocation,
    isOnlinePaymentDisabled: boolean,
    isDeliveryOnMinPrice: boolean,
    integrations: BranchIntegrations,
    deliveryDistricts: any[],
    copiesPrinting: number,
    automaticPrinting: boolean,
    active: boolean,
    __v: number,
    slug: string,
    staticImage: StaticImage[],
    categoriesGroupsEnabled: boolean,
    categoriesGroupsTitle: string[],
    contactEmail: string,
    mpToken: string,
    id: string
    _id?: string
}

export interface BranchFacebook {
    pixel: string,
}

export interface BranchGateway {
    iZettle?: {
        active: boolean,
    },
    pagseguro?: {
        version: string,
        splited: boolean,
        fee: number,
        maxInstallments: number,
        active: boolean,
    },
    pagarme?: {
        object: string,
        id: string,
        transfer_enabled: boolean,
        last_transfer: string,
        transfer_interval: string,
        transfer_day: number,
        automatic_anticipation_enabled: boolean,
        automatic_anticipation_type: string,
        automatic_anticipation_days: string,
        automatic_anticipation_1025_delay: number,
        anticipatable_volume_percentage: number,
        date_created: string,
        date_updated: string,
        bank_account: {
        object: string,
        id: string,
        bank_code: string,
        agencia: string,
        agencia_dv: null,
        conta: string,
        conta_dv: string,
        type: string,
        document_type: string,
        document_number: string,
        legal_name: string,
        charge_transfer_fees: boolean,
        pix_key: null,
        date_created: string,
        },
        status: string,
        status_reason: string,
        postback_url: string,
        register_information: null,
        metadata: null,
        external_id: string,
        mdr_configuration_id: null,
        fee_preset_id: null,
        automatic_anticipation_fee_reimbursement: null,
        statement_descriptor: null,
        pix_recipient_as_source: null,
        client_since: null,
    }
}

export interface BranchTakeAway {
    max: number,
    min: number,
    active: boolean
}

export interface BranchSettingsTotem {
    pix?: {
        type: string,
    },
    totemOpenFreezerBtn?: boolean,
    splash?: {
        slideImageEnabled: boolean,
        image: BranchSettingsTotemImage[],
        video: SettingsTotemVideo,
        preferredType: string,
    },
    bannerHeader?: BannerHeader,
    allowPrinting?: boolean,
    enableMicroMarket?: boolean,
    controllerId?: string,
    totemAdminPassword?: {
        password: string,
        createdAt: string,
        expirationDate: string,
        expirationInMinutes: number
    },
    totemSerialNumber?: string,
    plugPagActivationKey?: string,
    askforCPF?: boolean,
    askforClientsPassword?: boolean,
    askforPhone?: boolean,
    paymentLock?: boolean,
    memberShipMode?: boolean,
    allowDelivery?: boolean,
}

export interface BranchSettingsWeb {
    bannerHeader?: BannerHeader
}

export interface BranchSettingsTotemImage {
    active: boolean,
    photo: string,
    id: string
}

export interface BannerHeader {
    slideImageSpeed?: number,
    slideImageEnabled: boolean,
    image: BranchSettingsTotemImage[],
    video?: SettingsTotemVideo
}

export interface BranchSettingsApp {
    whatsAppButton: boolean,
    whatsAppNumber: string,
    defaultWhatsAppMessage: string,
    bannerHeader: BranchSettingsAppBannerHeader
}

export interface BranchSettingsAppBannerHeader {
    slideImageEnabled: boolean,
    image: SettingsAppBannerImage[],
    video: SettingsTotemVideo
}

export interface BranchScheduling {
    active: boolean,
    min: number,
    max: number
}

export interface PaymentMethodPix {
    receiverName: string,
    key: string,
    locationTypes: number[],
    active: boolean,
    type: string,
    name: string
}

export interface PaymentMethodIZettle {
    locationTypes: number[],
    active: boolean
}

export interface PaymentMethodOnline {
    locationTypes: number[],
    active: boolean
}

export interface PaymentMethodMoney {
    locationTypes: number[],
    active: boolean,
    name: string
}

export interface PaymentMethodsDefault {
    pix: PaymentMethodPix,
    iZettle: PaymentMethodIZettle,
    online: PaymentMethodOnline,
    money: PaymentMethodMoney
}

export interface BranchLocation {
    type: string,
    coordinates: number[],
    address: BranchAddress
}

export interface BranchAddress {
    postalCode: string,
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    complement?: string
}

export interface BranchIntegrations {
    varejofacil: {
        functionalities: any[],
    },
    klavi: {
        enabled: boolean,
        type: string,
        ageRestriction: boolean,
        doorSystem: boolean,
    },
    beedelivery: {
        linked: boolean,
        enabled: boolean,
    },
    motoboycom: {
        enabled: boolean,
    }
}


/* ############################################################################# */
/* ################################ Products ################################### */
/* ############################################################################# */
export interface Product {
    id: string,
    _id: string,
    seq: number,
    updatedAt: string,
    createdAt: string,
    name: string,
    category: string,
    description: string,
    slug: string,
    code: string,
    barCode: string,
    relatedPeriod: null,
    company: string,
    branch: string,
    __v: number,
    staticImage: StaticImage[],
    original_cloned_id: string,
    active: boolean,
    credit: Credit,
    period: ProductPeriod,
    complementsGroups: string[],
    sliderHeader: SliderHeader,
    settingsTotem: SettingsTotem,
    locationTypes: number[],
    preparationTime: number,
    stock: Stock,
    costprice: number,
    indoorPrices: any[],
    price: number,
    complementGroupCategory?: string
}


/* ############################################################################# */
/* ############################## Totem User ################################### */
/* ############################################################################# */
export interface TotemUser {
    id: string,
    _id: string,
    updatedAt: string,
    createdAt: string,
    active: boolean,
    customerOf?: string,
    branch: string,
    company: string,
    email: string,
    name: string,
    maxConcurrentLogins: number,
    password: string,
    isVerified: boolean,
    __v: number,
    deleted?: boolean,
    fixedUserToken?: string,
    tefCNPJ: string,
    tefCompany: string,
    tefComunicacao: string,
    tefIpAddress: string,
    tefOtp: string,
    tefTerminal: string,
    testFlag?: boolean
}

/* ############################################################################# */
/* ############################### Companies ################################### */
/* ############################################################################# */
export interface Company {
    updatedAt: string,
    createdAt: string,
    name: string,
    slug: string,
    phone: string,
    owner: string,
    subgroups: any[],
    groups: any[],
    availableModes: AvailableModes,
    omnitricks: Omnitricks,
    prepaidEnabled: boolean,
    driveThruEnabled: boolean,
    allowAllBranchesView: boolean,
    bannerHeader: BannerHeader,
    hideCategoriesMenu: boolean,
    isFacebookLoginInactive: boolean,
    isCompanyActive: boolean,
    loyalty: Loyalty,
    invoices: any[],
    branches: ObjectId[],
    employee: any[],
    locationTypes: number[],
    proximityRadiusTakeAway: number,
    proximityRadiusTakeAwayActive: boolean,
    settingsTotem: CompanySettingsTotem,
    settings: CompanySettings,
    blocksAndApartments: BlocksAndApartments[],
    deliveryindoorUserTypes: DeliveryindoorUserTypes[],
    faceRecognition: boolean,
    noAuthOrder: boolean,
    __v: number,
    layout: string,
    iconMenu: string,
    appUrl: string,
    customMapsApiKeys: any[],
    integrations: any[],
    marketplaceAccount: any[],
    minAppVersion: MinAppVersion,
    settingsOneSignal: SettingsOneSignal,
    _id: string,
    id?: string
}


export interface CompanySettings {
    currency: string,
    ourStoresText: string,
    driveThruInfo: string,
    driveThruText: string,
    onStoreText: string,
    toGoText: string,
    deliveryText: string,
    whatsAppVerifier: boolean,
    screenOrientation: string,
    icon512: string,
    headerLogo: string,
    primaryColor: string,
    secundaryColor: string
}


export interface CompanySettingsTotem {
    printerId: number,
    primaryColor: string,
    secundaryColor: string,
    layout: string,
    columns: string,
    customerNameFormat: number,
    consumeTypeBackground: string,
    selectPaymentBackground: string,
    consumeTypes: ConsumeTypes[],
    imageSize: string,
    allowPrinting: boolean,
    screenOrientation: string,
    modalFontColor: string,
    waitingBgColor: string,
    moneyPaymentText: string,
    paperSize: string,
    printNote: string
}


/* ############################################################################# */
/* ############################## Categories ################################### */
/* ############################################################################# */
export interface Category {
    id?: string,
    _id: string,
    seq: number,
    updatedAt: string,
    createdAt: string,
    name: string,
    description: string,
    branch: string,
    slug: string,
    categoryGroup: string,
    staticImage: StaticImage[],
    staticImageTotem: StaticImageTotem[],
    company: string,
    __v: number,
    original_cloned_id: string,
    integrationReference: any[],
    ingredients: boolean,
    products: string[],
    active: boolean,
    disabled?: boolean,
    locationTypes: number[]
}


/* ############################################################################# */
/* ############################## Complements ################################## */
/* ############################################################################# */
export interface Complement {
    _id: string,
    seq: number,
    updatedAt: string,
    createdAt: string,
    title: string,
    description: string,
    branch: string,
    company: string,
    code: string,
    __v: number,
    original_cloned_id: string,
    settingsTotem: SettingsTotem,
    ingredients: boolean,
    rules: Rules,
    active: boolean,
    locationTypes: number[],
    items: string[]
}


export interface ApiKey {
    updatedAt: string,
    createdAt: string,
    name: string,
    company: string,
    key: string,
    branches: ObjectId[],
    __v: number,
    id: string
}


/* ############################################################################# */
/* ################################ Period ##################################### */
/* ############################################################################# */
export interface Period {
    _id: string,
    createdAt: string,
    updatedAt: string
    title: string,
    branch: string,
    company: string,
    period: ProductPeriod,
    __v: number
}


/* ############################################################################# */
/* ################################# Forms ##################################### */
/* ############################################################################# */
export interface ProductForm {
    id: string,
    active: boolean,
    name: string,
    description: string,
    slug: string,
    price: string,
    preparationTime: string,
    code: string,
    barCode: string,
    images: Image[],
    period: string,
    complements: Complements[],
    branch?: string,
    company?: string,
    category?: string | unknown
}

export interface ComplementForm {
    id?: string,
    active: boolean,
    name: string,
    description: string,
    price: string,
    preparationTime: string,
    code: string,
    images: Image[],
    branch?: string,
    company?: string,
    complement?: string | unknown
}

export interface CloningMenuForm {
    originalBranch: string,
	destinationBranch: string
}

export interface CategoryForm {
    id?: string,
    active: boolean,
    disabled?: boolean,
    name: string,
    description: string,
    slug: string,
    staticImage: Image[],
    staticImageTotem: Image[],
    branch?: string | unknown,
    company?: string | unknown
}

export interface EditComplementGroupForm {
    id?: string,
    active: boolean,
    title: string,
    description: string,
    code: string,
    ingredients: boolean,
    minimum: string,
    maximum: string,
    mandatory: boolean,
    branch?: string | unknown,
    company?: string | unknown
}

export interface CreateCompanyForm {
    active: boolean,
    name: string,
    slug: string,
    phone: string,
    owner: string,
    prepaidEnabled: boolean,
    driveThruEnabled: boolean,
    allowAllBranchesView: boolean,
    bannerHeaderImages: Image[],
    hideCategoriesMenu: boolean,
    isFacebookLoginInactive: boolean,
    proximityRadiusTakeAwayActive: boolean,
    proximityRadiusTakeAway: string,
    settingsTotemPaymentLock: boolean,
    settingsTotemPrimaryColor: string,
    settingsTotemSecundaryColor: string,
    settingsTotemlayout: string,
    settingsScreenTotemOrientation: string,
    columns: string,
    customerNameFormat: string,
    consumeTypeBackground: Image[],
    selectPaymentBackground: Image[],
    allowPrinting: boolean,
    modalFontColor: string,
    selectedMenuFontColor: string,
    paperSize: string,
    printNote: string,
    moneyPaymentText: string,
    whatsAppButton: boolean,
    whatsAppNumber: string,
    whatsAppVerifier: boolean,
    defaultWhatsAppMessage: string,
    signUpCardRequired: boolean,
    currency: string,
    ourStoresText: string,
    driveThruInfo: string,
    onStoreText: string,
    toGoText: string,
    membershipMode: boolean,
    deliveryText: string,
    settingsPrimaryColor: string,
    settingsSecundaryColor: string,
    screenOrientation: string,
    icon512: Image[],
    headerLogo: Image[],
    favicon: Image[],
    noAuthOrder: boolean,
    oneSignalAppId: string,
    oneSignalRestApiKey: string,
    appUrl: string,
    layout: string,
    deliveryIndoor: boolean,
    deliveryIndoorType: string,
    faceRecognition: boolean,
    sellerSystem: boolean,
    paymentLock: boolean
}

export interface CreateBranchForm {
    id?: string,
    active: boolean,
    name: string,
    slug: string,
    phone: string,
    whatsappPhone: string,
    email: string,
    franchise: string | undefined | unknown,
    street: string,
    neighborhood: string,
    complement: string,
    number: string,
    cep: string,
    city: string,
    state: string,
    latitude: string,
    longitude: string,
    storeInfo: string,
    adminPassword: string,
    serialNumber: string,
    controllerID: string,
    plugPagActivationKey: string,
    openFreezerBtn: boolean,
    activeMicroMarket: boolean,
    askForClientCPF: boolean,
    askForClientPassword: boolean,
    askForClientPhone: boolean,
    allowPrinting: boolean,
    paymentLock: boolean,
    memberShipMode: boolean,
    allowDelivery: boolean,
    whatsappBtn: boolean,
    whatsappMessage: string,
    splashTotemImages: Image[],
    bannerHeaderTotemImages: Image[],
    bannerHeaderWebImages: Image[],
    bannerHeaderAppImages: Image[],
    automaticPrinting: boolean,
    normalizePrinting: boolean,
    isOnlinePaymentDisabled: boolean,
    htmlPrinting: boolean,
    quantityPrintingCopies: string,
    quantityPrintingColumns: string,
    serviceFee: string,
    minPrice: string,
    useMinPriceOnDelivery: boolean,
    schedulingOrders: boolean,
    minQuantitySO: string,
    maxQuantitySO: string,
    takeAwayOrders: boolean,
    minQuantityTAO: string,
    maxQuantityTAO: string,
    money: boolean,
    online: boolean,
    pix: boolean,
    pixDestinatary: string,
    pixKey: string,
    pixType: string,
}

export interface CreatePeriodForm {
    id?: string,
    branch?: string,
    company?: string,
    monday: PeriodTimeForm[],
    tuesday: PeriodTimeForm[],
    wednesday: PeriodTimeForm[],
    thursday: PeriodTimeForm[],
    friday: PeriodTimeForm[],
    saturday: PeriodTimeForm[],
    sunday: PeriodTimeForm[]
}

export interface CreateUserForm {
    name: string,
    email: string,
    password: string,
    role: string,
    companies?: string[],
    branches?: string[],
}

export interface TotemUserForm {
    active: boolean,
    branch?: string,
    company?: string,
    email: string,
    name: string,
    maxConcurrentLogins: string,
    password: string,
    tefCNPJ: string,
    tefCompany: string,
    tefComunication: string,
    tefIpAddress: string,
    tefOtp: string,
    tefTerminal: string
}

export interface CreateUserFormOptions {
    general: boolean,
    photo: boolean,
    aditionalInformations: boolean,
}

export interface Complements {
    name: string,
    order: number,
    _id: string
}

export interface ProductFormOptions {
    general: boolean,
    image: boolean,
    availability: boolean,
    complements: boolean
}

export interface CreateBranchFormOptions {
    general: boolean,
    totemConfig: boolean,
    splashTotemImages: boolean,
    bannerHeaderTotemImages: boolean,
    appConfig: boolean,
    bannerHeaderAppImages: boolean,
    webConfig?: boolean,
    bannerHeaderWebImages: boolean,
    printing: boolean,
    orders: boolean,
    payments: boolean
}

export interface CreatePeriodFormOptions {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean
}

export interface CreateCompanyFormOptions {
    general: boolean,
    totemConfig: boolean,
    generalConfig: boolean,
    imagesGeneralConfig: boolean,
    others: boolean,
}

export interface StoresPanelFormOptions {
    name: string,
    status: string,
    time: string
}

export interface StoresMenuPanelFormOptions {
    name: string,
    pdvCode: string
}

export interface StoresTotemPanelFormOptions {
    name: string
}

export interface ProductSummary {
    id: string;
    name: string;
    code: string;
    activeIn: string[];
    inactiveIn: string[];
}

export interface InactiveProductsBranches {
    name: string,
    branches: string[]
}

/* ############################################################################# */
/* ################################ Modals ##################################### */
/* ############################################################################# */
export interface LayoutModals {
    user: boolean,
    totemUser: boolean,
    branch: boolean,
    company: boolean
}

export interface CategoryAndComplementListModals {
    category: boolean,
    complementGroup: boolean
}

export interface CategoryAndComplementListSort {
    category: boolean,
    complementGroup: boolean
}

export interface CategoryAndComplementCardModals {
    createProduct: boolean,
    editProduct: boolean,
    createComplement: boolean,
    editComplement: boolean,
    category: boolean,
    complementGroup: boolean,
    sortProducts: boolean,
    delete: boolean
}

export interface CategoryAndComplementCardLoadings {
    page: boolean,
    category: boolean,
    complementGroup: boolean,
    product: boolean
}

export interface UserModalLoadings {
    page: boolean
    companies: boolean,
    branches: boolean
}

export interface BranchSubMenuOptions {
    itens: boolean,
    config: boolean
}

export interface PeriodModals {
    create: boolean,
    edit: boolean,
    delete: boolean
}

/* ############################################################################# */
/* ################################ Orders ##################################### */
/* ############################################################################# */
export interface Order {
    updatedAt: string,
    createdAt: string,
    amount: number,
    subtotal: number,
    total: number,
    branch: string,
    inutriOrder: null,
    inutriOrderDeliveryAddress: null,
    pinpadResponse: PinpadResponse,
    coupon: null,
    simpleAuth: string,
    totemClientName: string,
    cpfCustomer: string,
    totemNF_email: string,
    offers: any[],
    discount: null,
    withdrawalTime: null,
    note: string,
    appInfo: null,
    deliveryTime: string,
    additionalInfo: string,
    installments: number,
    originOrder: string,
    company: string,
    customer: string,
    seq: number,
    stoneTotemPayment: StoneTotemPayment,
    colmeiaOrders: any[],
    colmeiaItems: any[],
    change: number,
    paymentMethod: PaymentMethod,
    paid: boolean,
    review: Review,
    earnedPoints: number,
    serviceFee: number,
    deliveryFee: number,
    totemVersion: string,
    gifts: any[],
    items: Items[],
    history: any[],
    location: Location,
    locationType: number,
    status: number,
    __v: number,
    id: string
}


/* ############################################################################# */
/* ################################# Utils ##################################### */
/* ############################################################################# */
export interface ObjectId {
    $oid: string
}

export interface Image {
    photo: string | File,
    preferredType?: string,
    _id?: string,
    active: boolean,
    isNew?: boolean
}

export interface StaticImage {
    photo: string,
}

export interface StaticImageTotem {
    photo: string,
}

export interface Credit {
    creditValue: number,
    isCredit: boolean
}

export interface ProductPeriod {
    sunday: PeriodDay[],
    saturday: PeriodDay[],
    friday: PeriodDay[],
    thursday: PeriodDay[],
    wednesday: PeriodDay[],
    tuesday: PeriodDay[],
    monday: PeriodDay[]
}

export interface PeriodDay {
    disabled?: string,
    _id: string,
    to: string,
    from: string
}

export interface SettingsTotemVideo {
    enabled: boolean,
    loop: boolean,
    playing: boolean
}

export interface SettingsAppBannerImage {
    active: boolean,
    allowLink?: boolean,
    routeId?: string,
    routeType?: string,
    photo: string,
    id: ObjectId,
    preferredType?: string
}

export interface SliderHeader {
    slideImageEnabled: true,
    image: SettingsAppBannerImage[],
    video: SettingsTotemVideo
}

export interface Stock {
    lastStockReposition: number,
    dateLastReposition: string,
    minimalQuantity: number,
    currentQuantity: number,
    originalQuantity: number,
    active: boolean,
    totemSoldOut: boolean
}

export interface Rules {
    minQuantity: number,
    maxQuantity: number,
    mandatory: boolean
}

export interface SettingsTotem {
    locationTypes: number[]
}

export interface StoneTotemPayment {
    inUse: boolean
}

export interface PaymentMethod {
    kind: string,
    label: string,
    code: string | null
}

export interface Review {
    hidden: boolean
}

export interface Items {
    product: ObjectId,
    originalPrice: number,
    price: number,
    note: null,
    relatedOffer: null,
    name: string,
    title: string,
    costPrice: number,
    code: string,
    complements: any[],
    credit: Credit,
    quantity: number,
    id: ObjectId
}

export interface PinpadResponse {
    VIA_ESTABELECIMENTO: string | null,
    VIA_CLIENTE: string | null,
    NSU_HOST: string | null,
    CODRESP: string | null,
    TIPO_PARC: string | null,
    NSU_SITEF: string | null,
    REDE_AUT: string | null,
    NUM_PARC: string | null,
    COD_AUTORIZACAO: string | null,
    BANDEIRA: string | null
}

export interface Location {
    type: string,
    coordinates: number[],
    address: {
        coordinates: number[]
    }
}

export interface AvailableModes {
    education: boolean,
    omnibox: boolean,
    supermenu: boolean
}

export interface Omnitricks {
    hideBypassShowProducts: boolean
}

export interface Points {
    disabled: boolean,
    rate: number
}

export interface Loyalty {
    points: Points
}

export interface MinAppVersion {
    mobile: string
}

export interface SettingsOneSignal {
    appId: string,
    restApiKey: string
}

export interface DeliveryindoorUserTypes {
    slug: string,
    title: string
}

export interface BlocksAndApartments {
    active: boolean,
    allowedBranches: ObjectId[],
    apartments: Apartments[],
    _id: ObjectId,
    blockTitle: string
}

export interface Apartments {
    active: boolean,
    _id: ObjectId,
    title: string
}

export interface ConsumeTypes {
    value: number,
    active: boolean,
    text: string,
    icon: string,
    id: ObjectId
}

export interface PeriodTimeForm {
    _id: string,
    disabled: boolean,
    to: string,
    from: string
}

export interface SelectOptions {
    value: string,
    label: string
}

export interface TotemChargeHistory {
    id: string,
    to: string,
    from: string,
    status: string,
    createdAt: string,
    details: {
        categoriesCloned: number,
        productsCloned: number,
        complementsCloned: number,
        executedAt: string
    },
    time: string
}

export interface OptionType {
    value: string;
    label: string;
}

export interface TotemEfficiency {
    name: string,
    branch: string,
    totems: TotemEfficiencyData[]
}

export interface TotemEfficiencyData {
    name: string,
    active: boolean,
    email: string,
    totem: string,
    efficiency: number
}