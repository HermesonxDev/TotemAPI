import { Category, Complement, CategoryAndComplementListModals, Product, CategoryAndComplementListSort } from "@/utils/interfaces"
import CategoryAndComplementCard from "./CategoryAndComplementCard"
import { useState } from "react"
import CreateCategoryModal from "./CreateCategoryModal/Index"
import CreateComplementGroupModal from "./CreateComplementGroupModal/Index"
import SortCategories from "./SortCategories"
import SortComplementGroup from "./SortComplementGroup"

interface ICategoryAndComplementListProps {
    branch: string,
    company: string | undefined,
    categories?: Category[],
    categoriesProducts?: Product[],
    complementsProducts?: Product[],
    complements?: Complement[],
    categoriesComplements?: Complement[],
    sortCategoriesProducts?: Product[],
    sortComplementsProducts?: Product[],
}

const CategoryAndComplementList: React.FC<ICategoryAndComplementListProps> = ({
    branch,
    company,
    categories,
    complements,
    categoriesProducts,
    sortCategoriesProducts,
    complementsProducts,
    categoriesComplements,
    sortComplementsProducts
}) => {

    const [modals, setModals] = useState<CategoryAndComplementListModals>({
        category: false,
        complementGroup: false
    })

    const [sortType, setSortType] = useState<CategoryAndComplementListSort>({
        category: false,
        complementGroup: false
    })

    const handleModalsClick = (option: keyof CategoryAndComplementListModals, value: boolean) => {
        setModals({
            category: false,
            complementGroup: false,
            [option]: value
        })
    }

    const handleSortClick = (option: keyof CategoryAndComplementListSort, value: boolean) => {
        setSortType({
            category: false,
            complementGroup: false,
            [option]: value
        })
    }

    return (
        <div className="flex flex-col gap-3">
            {categories &&
                <>
                    <div className="flex flex-row justify-between">
                        <button
                            className="text-white bg-black px-3 py-1 rounded"
                            onClick={() => handleModalsClick('category', true)}
                        >Adicionar Nova Categoria</button>

                        <button
                            className="text-white bg-black px-3 py-1 rounded"
                            onClick={() => handleSortClick('category', !sortType.category)}
                        >Ordenar Categorias</button>
                    </div>

                    {!sortType.category && categories.map(category => (
                        <CategoryAndComplementCard
                            key={category._id}
                            categoryID={category._id}
                            categories={categories}
                            categoriesProducts={categoriesProducts}
                            sortCategoriesProducts={sortCategoriesProducts}
                            categoriesComplements={categoriesComplements}
                            name={category.name}
                            active={category.active}
                            branch={branch}
                            company={company}
                            type="category"
                        />
                    ))}

                    {sortType.category &&
                        <SortCategories sortedCategories={categories} />
                    }
                </>
            }

            {complements &&
                <>
                    <div className="flex flex-row justify-between">
                        <button
                            className="text-white bg-black px-3 py-1 rounded"
                            onClick={() => handleModalsClick('complementGroup', true)}
                            >Adicionar Grupo de Complementos</button>

                        <button
                            className="text-white bg-black px-3 py-1 rounded"
                            onClick={() => handleSortClick('complementGroup', !sortType.complementGroup)}
                            >Ordenar Grupos de Complementos</button>
                    </div>

                    {!sortType.complementGroup && complements.map(complement => (
                        <CategoryAndComplementCard
                            key={complement._id}
                            complementID={complement._id}
                            complements={complements}
                            complementsProducts={complementsProducts}
                            sortComplementsProducts={sortComplementsProducts}
                            name={complement.title}
                            active={complement.active}
                            branch={branch}
                            company={company}
                            type="complement"
                            />
                        ))}
                        
                    {sortType.complementGroup &&
                        <SortComplementGroup sortedComplementsGroups={complements} />
                    }
                </>
            }

            <CreateCategoryModal
                show={modals.category}
                onClose={() => handleModalsClick('category', false)}
            />

            <CreateComplementGroupModal
                show={modals.complementGroup}
                onClose={() => handleModalsClick('complementGroup', false)}
            />
        </div>
    )
}

export default CategoryAndComplementList
