import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import CardDroppable from "./CardDroppable"
import { Branch, Company, Category } from "@/utils/interfaces"
import api from "@/Services/api";
import { Link, usePage } from "@inertiajs/react"
import Loading from "./Loading";

interface ISortCategoriesProps {
    sortedCategories: Category[]
}

const SortCategories: React.FC<ISortCategoriesProps> = ({ sortedCategories }) => {

    const { props } = usePage()

    const branch = props.branch as Branch
    const company = props.company as Company

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const updatedCategories = Array.from(categories);
        const [reorderedItem] = updatedCategories.splice(result.source.index, 1);
        updatedCategories.splice(result.destination.index, 0, reorderedItem);

        const newCategories = updatedCategories.map((product, index) => ({
            ...product,
            seq: categories[index].seq
        }));

        setCategories(newCategories);
    };

    const handleConfirmChange = async (categories: Category[]) => {
        try {
            setLoading(true)

            const data = { categories: categories }
            await api.post(`/sort/categories`, data)
            window.location.href = `/company/${company ? company.id : ""}/branch/${branch ? branch.id : ""}/products-categories`
        } catch (error) {
            console.error("Erro no handleConfirmChange: ", error)
        }
    }

    useEffect(() => {
        if (sortedCategories) {
            setCategories(sortedCategories);
        }
    }, [sortedCategories]);

    return (
        <div className="bg-gray-200 p-3 rounded-md w-full flex flex-col justify-between">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="categories"
                    type="list"
                    direction="vertical"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {categories.map((category, index) => (
                                <CardDroppable
                                    key={category._id}
                                    id={category._id}
                                    name={category.name}
                                    index={index}
                                />
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="flex justify-end gap-2 mt-2">
                {!loading
                    ? <>
                        <button
                            className="text-white bg-green-600 px-3 py-1 rounded"
                            onClick={() => handleConfirmChange(categories)}
                        >Confirmar</button>

                        <Link
                            className="text-white bg-red-600 px-3 py-1 rounded"
                            href={`/company/${company ? company.id : ""}/branch/${branch ? branch.id : ""}/products-categories`}
                        >Fechar</Link>
                    </>
                    : <Loading
                        width="50px"
                        marginTop="0"
                    />
                }
            </div>
        </div>
    )
}

export default SortCategories