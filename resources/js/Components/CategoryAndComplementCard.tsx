import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Category, Complement, CategoryAndComplementCardModals, Product, CategoryAndComplementCardLoadings } from "@/utils/interfaces";
import GridContainer from "./GridContainer";
import GridHeaderRow from "./GridHeaderRow";
import GridHeaderItem from "./GridHeaderItem";
import GridBodyRow from "./GridBodyRow";
import GridBodyItem from "./GridBodyItem";
import { Link } from "@inertiajs/react";
import formatMoney from "@/utils/formatMoney";
import Toggle from "./Toggle";
import GridBodyImage from "./GridBodyImage";
import EditProductModal from "./EditProductModal/Index";
import EditComplementModal from "./EditComplementModal/Index";
import DeleteModal from "./DeleteModal/Index";
import EditCategoryModal from "./EditCategoryModal/Index";
import EditComplementGroupModal from "./EditComplementGroupModal/Index";
import api from "@/Services/api";
import SortProducts from "./SortProducts";
import CreateProductModal from "./CreateProductModal/Index";
import CreateComplementModal from "./CreateComplementModal/Index";

interface ICategoryAndComplementCardProps {
    name: string,
    active: boolean,
    categoryID?: string,
    categories?: Category[],
    categoriesProducts?: Product[],
    sortCategoriesProducts?: Product[],
    complementsProducts?: Product[],
    complementID?: string,
    complements?: Complement[],
    sortComplementsProducts?: Product[],
    categoriesComplements?: Complement[],
    branch: string,
    company: string | undefined,
    type: string,
}

const CategoryAndComplementCard: React.FC<ICategoryAndComplementCardProps> = ({
    name,
    active,
    categoryID,
    categories,
    categoriesProducts,
    sortCategoriesProducts,
    complementsProducts,
    complementID,
    complements,
    sortComplementsProducts,
    categoriesComplements,
    branch,
    company,
    type
}) => {

    const [loading, setLoading] = useState<CategoryAndComplementCardLoadings>({
        page: true,
        category: false,
        complementGroup: false,
        product: false
    })

    const [toggleMessage, setToggleMessage] = useState<string>("")

    const [modals, setModals] = useState<CategoryAndComplementCardModals>({
        createProduct: false,
        editProduct: false,
        createComplement: false,
        editComplement: false,
        category: false,
        complementGroup: false,
        sortProducts: false,
        delete: false
    })

    const [editedProduct, setEditedProduct] = useState<Product | null>(null)

    const [editedCategory, setEditedCategory] = useState<Category | null>(null)

    const [editedComplementGroup, setEditedComplementGroup] = useState<Complement | null>(null)

    const [deletedProductOrCategoryOrComplementGroup, setDeletedProductOrCategoryOrComplementGroup] = useState<Product | Category | Complement | null>(null)

    const [EndpointUrl, setEndpointUrl] = useState<string>("")

    const { props } = usePage()
    const categoryIDFromURL = props.categoryID
    const complementIDFromURL = props.complementID

    const handleModalsClick = (option: keyof CategoryAndComplementCardModals, value: boolean) => {
        setModals({
            createProduct: false,
            editProduct: false,
            createComplement: false,
            editComplement: false,
            category: false,
            complementGroup: false,
            sortProducts: false,
            delete: false,
            [option]: value
        })
    }

    const handleLoadingsClick = (option: keyof CategoryAndComplementCardLoadings, value: boolean) => {
        setLoading({
            page: false,
            category: false,
            complementGroup: false,
            product: false,
            [option]: value
        })
    }

    const openEditProductModal = (productOrComplementID: string) => {
        let editedItem = null

        if (type === "category") {
            editedItem = categoriesProducts?.find(product => product._id === productOrComplementID)
            handleModalsClick('editProduct', true)

        } else {
            editedItem = complementsProducts?.find(complement => complement._id === productOrComplementID)
            handleModalsClick('editComplement', true)
        }

        setEditedProduct(editedItem || null)
    }

    const openEditCategoryModal = (categoryID: string | undefined) => {
        const editedCategory = categories?.find(category => category._id === categoryID)
        handleModalsClick('category', true)
        setEditedCategory(editedCategory || null)
    }

    const openEditComplementGroupModal = (complementID: string | undefined) => {
        const editedComplementGroup = complements?.find(complement => complement._id === complementID)
        handleModalsClick('complementGroup', true)
        setEditedComplementGroup(editedComplementGroup || null)
    }

    const openDeleteModal = (productOrCategoryOrComplementGroupID: string | undefined, url: string, actionType: string) => {
        let deletedProductOrCategoryOrComplementGroup = null

        if (actionType === "Product") {
            if (type === "category") {
                deletedProductOrCategoryOrComplementGroup = categoriesProducts?.find(product => product._id === productOrCategoryOrComplementGroupID)
            }

            if (type === "complement") {
                deletedProductOrCategoryOrComplementGroup = complementsProducts?.find(complement => complement._id === productOrCategoryOrComplementGroupID)
            }
        }

        if (actionType === "Category" || actionType === "Complement") {
            if (type === "category") {
                deletedProductOrCategoryOrComplementGroup = categories?.find(category => category._id === productOrCategoryOrComplementGroupID)
            }

            if (type === "complement"){
                deletedProductOrCategoryOrComplementGroup = complements?.find(complement => complement._id === productOrCategoryOrComplementGroupID)
            }
        }

        handleModalsClick('delete', true)
        setDeletedProductOrCategoryOrComplementGroup(deletedProductOrCategoryOrComplementGroup || null)
        setEndpointUrl(url)
    }

    const onCloseDeleteModal = () => {
        setDeletedProductOrCategoryOrComplementGroup(null)
        handleModalsClick('delete', false)
    }

    const handleToggleCategory = async (id: string, status: boolean) => {
        try {
            const Message = toggleMessageValidate(status)

            handleLoadingsClick('category', true)
            setToggleMessage(Message)

            const data = { id: id, status: status }
            await api.post('/status/category', data)

            window.location.reload()
        } catch (error) {
            handleLoadingsClick('category', false)
            console.error("Erro no handleToggleCategory: ", error)
        }
    }

    const handleToggleComplementGroup = async (id: string, status: boolean) => {
        try {
            const Message = toggleMessageValidate(status)

            handleLoadingsClick('complementGroup', true)
            setToggleMessage(Message)

            const data = { id: id, status: status }
            await api.post('/status/complement-group', data)

            window.location.reload()
        } catch (error) {
            handleLoadingsClick('complementGroup', false)
            console.error("Erro no handleToggleComplementGroup: ", error)
        }
    }

    const handleToggleProduct = async (id: string, status: boolean) => {
        try {
            const Message = toggleMessageValidate(status)

            handleLoadingsClick('product', true)
            setToggleMessage(Message)

            const data = { id: id, status: status }
            await api.post('/status/product', data)

            window.location.reload()
        } catch (error) {
            handleLoadingsClick('product', false)
            console.error("Erro no handleToggleProduct: ", error)
        }
    }

    const toggleMessageValidate = (status: boolean) => {
        if (status === true) {
            return "(Ativando...)"
        } else {
            return "(Inativando...)"
        }
    }

    useEffect(() => {
        if (type === "category" && categoriesProducts && categoriesProducts.length > 0) {
            handleLoadingsClick('page', false)
        }

        if (type === "category" && sortCategoriesProducts && sortCategoriesProducts.length > 0) {
            handleLoadingsClick('page', false)
        }

        if (type === "complement" && complementsProducts && complementsProducts.length > 0) {
            handleLoadingsClick('page', false)
        }

        if (type === "complement" && sortComplementsProducts && sortComplementsProducts.length > 0) {
            handleLoadingsClick('page', false)
        }
    }, [categoriesProducts, complementsProducts, sortCategoriesProducts, sortComplementsProducts])
    
    return (
        <div>
            <div className="flex flex-row items-center justify-between bg-gray-100 h-14 rounded p-3 mb-1">
                <h2>{name}</h2>

                    {type === "category" &&
                        <div className="flex flex-row items-center justify-between gap-2">
                            {!loading.category ?
                                <Toggle 
                                    checked={active} 
                                    onChange={() => categoryID && handleToggleCategory(categoryID, !active)} 
                                    labelRight={active ? "Ativo" : "Inativo"} 
                                />
                                : <p>{toggleMessage}</p>
                            }

                            <button
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => openEditCategoryModal(categoryID)}
                            >Editar</button>

                            <button
                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                onClick={() => openDeleteModal(categoryID, "/delete/category", "Category")}
                            >Excluir</button>

                            <Link
                                preserveState
                                href={`/company/${company}/branch/${branch}/products-categories/sort-items/${categoryID}`}
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleLoadingsClick('page', true)}
                            >Ordenar Produtos</Link>

                            <Link
                                preserveState
                                href={`/company/${company}/branch/${branch}/products-categories/${categoryID}`}
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleLoadingsClick('page', true)}
                            >Ver Produtos</Link>
                        </div>
                    }

                    {type === "complement" &&
                        <div className="flex flex-row items-center gap-2">
                            {!loading.complementGroup ?
                                <Toggle 
                                    checked={active} 
                                    onChange={() => complementID && handleToggleComplementGroup(complementID, !active)} 
                                    labelRight={active ? "Ativo" : "Inativo"} 
                                />
                                : <p>{toggleMessage}</p>
                            }

                            <button
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => openEditComplementGroupModal(complementID)}
                            >Editar</button>

                            <button
                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                onClick={() => openDeleteModal(complementID, "/delete/complement-group", "Complement")}
                            >Excluir</button>

                            <Link
                                preserveState
                                href={`/company/${company}/branch/${branch}/complements-categories/sort-items/${complementID}`}
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleLoadingsClick('page', true)}
                            >Ordenar Produtos</Link>

                            <Link
                                preserveState
                                href={`/company/${company}/branch/${branch}/complements-categories/${complementID}`}
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleLoadingsClick('page', true)}
                            >Ver Produtos</Link>
                        </div>
                    }
            </div>

            {type === "category" && categoryID === categoryIDFromURL && (!sortCategoriesProducts || sortCategoriesProducts.length === 0) && !loading.page &&
                <GridContainer>
                    <GridHeaderRow>
                        <GridHeaderItem>Imagem</GridHeaderItem>
                        <GridHeaderItem>Código PDV</GridHeaderItem>
                        <GridHeaderItem>Nome</GridHeaderItem>
                        <GridHeaderItem>Status</GridHeaderItem>
                        <GridHeaderItem>Disponivel</GridHeaderItem>
                        <GridHeaderItem>Preço</GridHeaderItem>
                        <GridHeaderItem>Ações</GridHeaderItem>
                    </GridHeaderRow>

                    {categoriesProducts?.map((categoryProduct) => (
                        <GridBodyRow key={categoryProduct._id}>
                            <GridBodyImage src={categoryProduct.sliderHeader.image[0]?.photo} />
                            <GridBodyItem border>{categoryProduct.code}</GridBodyItem>
                            <GridBodyItem border>{categoryProduct.name}</GridBodyItem>
                            <GridBodyItem border>
                                <Toggle
                                    checked={categoryProduct.active}
                                    onChange={() => handleToggleProduct(categoryProduct._id, !categoryProduct.active)}
                                    labelRight={categoryProduct.active ? "Ativo" : "Inativo"}
                                />
                            </GridBodyItem>
                            <GridBodyItem border>
                                <Toggle
                                    checked={false}
                                    onChange={() => {}}
                                    labelRight="Esgotado"
                                />
                                
                            </GridBodyItem>
                            <GridBodyItem border>{formatMoney(categoryProduct.price)}</GridBodyItem>
                            <GridBodyItem border className="gap-2">
                                <button
                                    type="button"
                                    className="text-white bg-black px-3 py-1 rounded"
                                    onClick={() => openEditProductModal(categoryProduct._id)}
                                >Editar</button>

                                <button
                                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                    onClick={() => openDeleteModal(categoryProduct._id, '/delete/product', "Product")}
                                >Excluir</button>
                            </GridBodyItem>
                        </GridBodyRow>
                    ))}

                    <GridBodyRow>
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem>
                            <button
                                type="button"
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleModalsClick('createProduct', true)}
                            >Adicionar Produto</button>
                        </GridBodyItem>
                    </GridBodyRow>
                </GridContainer>
            }

            {type === "category" && categoryID === categoryIDFromURL && sortCategoriesProducts && sortCategoriesProducts.length > 0 && !loading.page &&
                <SortProducts sortedProducts={sortCategoriesProducts} type="category"/>
            }

            {type === "complement" && complementID === complementIDFromURL && (!sortComplementsProducts || sortComplementsProducts.length === 0) && !loading.page &&
                <GridContainer>
                    <GridHeaderRow>
                        <GridHeaderItem>Imagem</GridHeaderItem>
                        <GridHeaderItem>Código PDV</GridHeaderItem>
                        <GridHeaderItem>Nome</GridHeaderItem>
                        <GridHeaderItem>Status</GridHeaderItem>
                        <GridHeaderItem>Disponivel</GridHeaderItem>
                        <GridHeaderItem>Preço</GridHeaderItem>
                        <GridHeaderItem>Ações</GridHeaderItem>
                    </GridHeaderRow>

                    {complementsProducts?.map((complementProduct) => (
                        <GridBodyRow key={complementProduct._id}>
                            <GridBodyImage src={complementProduct.staticImage[0]?.photo} />
                            <GridBodyItem border>{complementProduct.code}</GridBodyItem>
                            <GridBodyItem border>{complementProduct.name}</GridBodyItem>
                            <GridBodyItem border>
                                <Toggle
                                    checked={complementProduct.active}
                                    onChange={() => handleToggleProduct(complementProduct._id, !complementProduct.active)}
                                    labelRight={complementProduct.active ? "Ativo" : "Inativo"}
                                />
                            </GridBodyItem>
                            <GridBodyItem border>
                                <Toggle
                                    checked={false}
                                    onChange={() => {}}
                                    labelRight="Esgotado"
                                />
                            </GridBodyItem>
                            <GridBodyItem border>{formatMoney(complementProduct.price)}</GridBodyItem>
                            <GridBodyItem border className="gap-2">
                                <button
                                    type="button"
                                    className="text-white bg-black px-3 py-1 rounded"
                                    onClick={() => openEditProductModal(complementProduct._id)}
                                >Editar</button>

                                <button
                                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                    onClick={() => openDeleteModal(complementProduct._id, '/delete/product', "Product")}
                                >Excluir</button>
                            </GridBodyItem>
                        </GridBodyRow>
                    ))}

                    <GridBodyRow>
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem />
                        <GridBodyItem>
                            <button
                                type="button"
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleModalsClick('createComplement', true)}
                            >Adicionar Complemento</button>
                        </GridBodyItem>
                    </GridBodyRow>
                </GridContainer>
            }

            {type === "complement" && complementID === complementIDFromURL && sortComplementsProducts && sortComplementsProducts.length > 0 && !loading.page &&
                <SortProducts sortedProducts={sortComplementsProducts} type="complement"/>
            }

            <EditComplementGroupModal
                show={modals.complementGroup}
                editedComplementGroup={editedComplementGroup}
                onClose={() => handleModalsClick('complementGroup', false)}
            />

            <EditCategoryModal
                show={modals.category}
                editedCategory={editedCategory}
                onClose={() => handleModalsClick('category' ,false)}
            />

            <CreateProductModal
                show={modals.createProduct}
                categoriesComplements={categoriesComplements}
                onClose={() => handleModalsClick('createProduct', false)}
            />

            <EditProductModal
                show={modals.editProduct}
                editedProduct={editedProduct}
                categoriesComplements={categoriesComplements}
                onClose={() => handleModalsClick('editProduct', false)}
            />

            <CreateComplementModal
                show={modals.createComplement}
                onClose={() => handleModalsClick('createComplement', false)}
            />

            <EditComplementModal
                show={modals.editComplement}
                editedProduct={editedProduct}
                categoriesComplements={categoriesComplements}
                onClose={() => handleModalsClick('editComplement' ,false)}
            />

            <DeleteModal
                show={modals.delete}
                deletedProductOrCategoryOrComplementGroup={deletedProductOrCategoryOrComplementGroup}
                url={EndpointUrl}
                onClose={onCloseDeleteModal}
            />
        </div>
    );
};

export default CategoryAndComplementCard;
