import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Category, Complement, CategoryAndComplementCardModals, Product, CategoryAndComplementCardLoadings, ComplementProducts } from "@/utils/interfaces";
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
import SortProducts from "./SortProducts";
import CreateProductModal from "./CreateProductModal/Index";
import CreateComplementModal from "./CreateComplementModal/Index";
import { useProduct } from "@/hooks/Product";
import CreateComplementGroupCategoryModal from "./CreateComplementGroupCategoryModal/Index";

interface ICategoryAndComplementCardProps {
    name: string,
    active: boolean,
    categoryID?: string,
    categories?: Category[],
    categoriesProducts?: Product[],
    sortCategoriesProducts?: Product[],
    complementsProducts?: ComplementProducts[],
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

    const {
        loadings,
        loading,
        handleLoadingsClick,
        handleToggle
    } = useProduct()

    const [modals, setModals] = useState<CategoryAndComplementCardModals>({
        createProduct: false,
        editProduct: false,
        createComplement: false,
        editComplement: false,
        category: false,
        complementGroup: false,
        sortProducts: false,
        complementGroupCategory: false,
        delete: false
    })

    const [editedProduct, setEditedProduct] = useState<Product | null>(null)

    const [editedCategory, setEditedCategory] = useState<Category | null>(null)

    const [editedComplementGroup, setEditedComplementGroup] = useState<Complement | null>(null)

    const [deletedEntity, setdeletedEntity] = useState<Product | Category | Complement | null>(null)

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
            complementGroupCategory: false,
            delete: false,
            [option]: value
        })
    }

    const openEditProductModal = (productOrComplementID: string, complementProductID?: string) => {
        let editedItem = null

        if (type === "category") {
            editedItem = categoriesProducts?.find(product => product._id === productOrComplementID)
            handleModalsClick('editProduct', true)

        } else {
            const complementGroup = complementsProducts?.find(complement => complement.id === complementProductID)
            editedItem = complementGroup?.products.find(complement => complement.id === productOrComplementID)
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

    const openDeleteModal = (
        productOrCategoryOrComplementGroupID: string | undefined,
        url: string,
        actionType: string,
        complementProductID?: string
    ) => {
        let deletedEntity = null

        if (actionType === "Product") {
            if (type === "category") {
                deletedEntity = categoriesProducts?.find(product => product._id === productOrCategoryOrComplementGroupID)
            }

            if (type === "complement") {
                const complementGroup = complementsProducts?.find(complement => complement.id === complementProductID)
                deletedEntity = complementGroup?.products.find(complement => complement._id === productOrCategoryOrComplementGroupID)
            }
        }

        if (actionType === "Category" || actionType === "Complement") {
            if (type === "category") {
                deletedEntity = categories?.find(category => category._id === productOrCategoryOrComplementGroupID)
            }

            if (type === "complement"){
                deletedEntity = complements?.find(complement => complement._id === productOrCategoryOrComplementGroupID)
            }
        }

        handleModalsClick('delete', true)
        setdeletedEntity(deletedEntity || null)
        setEndpointUrl(url)
    }

    const onCloseDeleteModal = () => {
        setdeletedEntity(null)
        handleModalsClick('delete', false)
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
                        {loadings[categoryID ? categoryID : ""]?.category ? (
                            <p>{loadings[categoryID ? categoryID : ""].category}</p>
                        ) : (
                            <Toggle 
                                checked={active} 
                                onChange={() => categoryID && handleToggle(categoryID, !active, 'category')} 
                                labelRight={active ? "Ativo" : "Inativo"} 
                            />
                        )}

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
                        {loadings[complementID ? complementID : ""]?.complementGroup ? (
                            <p>{loadings[complementID ? complementID : ""].complementGroup}</p>
                        ) : (
                            <Toggle 
                                checked={active} 
                                onChange={() => complementID && handleToggle(complementID, !active, 'complementGroup')} 
                                labelRight={active ? "Ativo" : "Inativo"} 
                            />
                        )}

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
                            href={`/company/${company}/branch/${branch}/complements-categories/${complementID}`}
                            className="text-white bg-black px-3 py-1 rounded"
                            onClick={() => handleLoadingsClick('page', true)}
                        >Ver Produtos</Link>
                    </div>
                }
            </div>

            {type === "category" && categoryID === categoryIDFromURL && (!sortCategoriesProducts || sortCategoriesProducts.length === 0) && !loading.page &&
                <GridContainer gap="3" marginTop="3">
                    <GridHeaderRow
                        gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                        background="gray-800"
                    >
                        <GridHeaderItem padding="p-2">Imagem</GridHeaderItem>
                        <GridHeaderItem padding="p-2">Código PDV</GridHeaderItem>
                        <GridHeaderItem padding="p-2">Nome</GridHeaderItem>
                        <GridHeaderItem padding="p-2">Status</GridHeaderItem>
                        <GridHeaderItem padding="p-2">Disponivel</GridHeaderItem>
                        <GridHeaderItem padding="p-2">Preço</GridHeaderItem>
                        <GridHeaderItem padding="p-2">Ações</GridHeaderItem>
                    </GridHeaderRow>

                    {categoriesProducts?.map((categoryProduct) => (
                        <GridBodyRow
                            key={categoryProduct._id}
                            gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                            background="gray-200"
                        >
                            <GridBodyImage src={categoryProduct.sliderHeader.image[0]?.photo} />
                            <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">{categoryProduct.code}</GridBodyItem>
                            <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">{categoryProduct.name}</GridBodyItem>

                            <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                {loadings[categoryProduct._id]?.status ? (
                                    <p>{loadings[categoryProduct._id].status}</p>
                                ) : (
                                    <Toggle
                                        checked={categoryProduct.active}
                                        onChange={() => handleToggle(categoryProduct._id, !categoryProduct.active, 'status')}
                                        labelRight={categoryProduct.active ? "Ativo" : "Inativo"}
                                    />
                                )}
                            </GridBodyItem>

                            <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                {loadings[categoryProduct._id]?.soldOut ? (
                                    <p>{loadings[categoryProduct._id].soldOut}</p>
                                ) : (
                                    <Toggle
                                        checked={categoryProduct.stock.totemSoldOut}
                                        onChange={() => handleToggle(categoryProduct._id, !categoryProduct.stock.totemSoldOut, 'soldOut')}
                                        labelRight="Esgotado"
                                    />
                                )}
                            </GridBodyItem>

                            <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                {formatMoney(categoryProduct.price)}
                            </GridBodyItem>
                            
                            <GridBodyItem padding="py-[10px]" className="flex justify-center items-center gap-2">
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

                    <GridBodyRow
                        gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                        background="gray-200"
                    >
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]">
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
                <SortProducts
                    sortedProducts={sortCategoriesProducts}
                    type="category"
                    branch={branch}
                    company={company}
                />
            }

            {type === "complement" && complementID === complementIDFromURL && (!sortComplementsProducts || sortComplementsProducts.length === 0) && !loading.page &&
                <GridContainer gap="3" marginTop="3">
                    {complementsProducts?.map((complementProduct) => {

                        const products = complementProduct.products

                        return (
                            <> 
                                <GridHeaderRow
                                    gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                                    background="gray-800"
                                >
                                    <GridHeaderItem padding="p-2">Imagem</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Código PDV</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Nome</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Grupo</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Status</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Disponivel</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Preço</GridHeaderItem>
                                    <GridHeaderItem padding="p-2">Ações</GridHeaderItem>
                                </GridHeaderRow>

                                {products.map(product => (
                                    <GridBodyRow
                                        key={product.id}
                                        gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                                        background="gray-200"
                                        className="mx-5"
                                    >
                                        <GridBodyImage src={product.staticImage[0]?.photo} width="w-[40%]"/>
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">{product.code}</GridBodyItem>
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">{product.name}</GridBodyItem>
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">{complementProduct.name}</GridBodyItem>
            
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                            {loadings[product.id]?.status ? (
                                                <p>{loadings[product.id].status}</p>
                                            ) : (
                                                <Toggle
                                                    checked={product.active}
                                                    onChange={() => handleToggle(product.id, !product.active, 'status')}
                                                    labelRight={product.active ? "Ativo" : "Inativo"}
                                                />
                                            )}
                                        </GridBodyItem>
            
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                            {loadings[product.id]?.soldOut ? (
                                                <p>{loadings[product.id].soldOut}</p>
                                            ) : (
                                                <Toggle
                                                    checked={product.stock.totemSoldOut}
                                                    onChange={() => handleToggle(product.id, !product.stock.totemSoldOut, 'soldOut')}
                                                    labelRight="Esgotado"
                                                />
                                            )}
                                        </GridBodyItem>
            
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                            {formatMoney(product.price)}
                                        </GridBodyItem>
            
                                        <GridBodyItem padding="py-[10px]" className="flex justify-center items-center gap-2">
                                            <button
                                                type="button"
                                                className="text-white bg-black px-3 py-1 rounded"
                                                onClick={() => openEditProductModal(product.id, complementProduct.id)}
                                            >Editar</button>
            
                                            <button
                                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                                onClick={() => openDeleteModal(product.id, '/delete/product', "Product")}
                                            >Excluir</button>
                                        </GridBodyItem>
                                    </GridBodyRow>
                                ))}

                                <GridBodyRow
                                    gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                                    background="gray-200"
                                    className="mx-5"
                                >
                                    <GridBodyItem padding="py-[10px]"/>
                                    <GridBodyItem padding="py-[10px]"/>
                                    <GridBodyItem padding="py-[10px]"/>
                                    <GridBodyItem padding="py-[10px]"/>
                                    <GridBodyItem padding="py-[10px]"/>
                                    <GridBodyItem padding="py-[10px]"/>
                                    <GridBodyItem padding="py-[10px]" />
                                    <GridBodyItem padding="py-[10px]" className="flex justify-center items-center">
                                        <Link
                                            preserveState
                                            href={`/company/${company}/branch/${branch}/complements-categories/sort-items/${complementID}/${complementProduct.id}`}
                                            className="text-white bg-black px-3 py-1 rounded"
                                            onClick={() => handleLoadingsClick('page', true)}
                                        >Ordenar Produtos</Link>
                                    </GridBodyItem>
                                </GridBodyRow>
                            </>
                        )
                    })}
                    
                    <GridBodyRow
                        gridCols="grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_2fr]"
                        background="gray-200"
                    >
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]"/>
                        <GridBodyItem padding="py-[10px]" className="flex fex-row gap-2 mx-auto">
                            <button
                                className="text-white bg-black px-3 py-1 rounded"
                                onClick={() => handleModalsClick('complementGroupCategory', true)}
                            >Adicionar Sub-Grupo</button>

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
                <SortProducts
                    sortedProducts={sortComplementsProducts}
                    type="complement"
                    branch={branch}
                    company={company}
                />
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

            <CreateComplementGroupCategoryModal
                show={modals.complementGroupCategory}
                onClose={() => handleModalsClick('complementGroupCategory', false)}
            />

            <DeleteModal
                show={modals.delete}
                deletedEntity={deletedEntity}
                url={EndpointUrl}
                onClose={onCloseDeleteModal}
            />
        </div>
    );
};

export default CategoryAndComplementCard;
