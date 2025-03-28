import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import CardDroppable from "./CardDroppable"
import { Branch, Company, Category, Product } from "@/utils/interfaces"
import api from "@/Services/api";
import { Link, usePage } from "@inertiajs/react"
import Loading from "./Loading";

interface ISortProductsProps {
    sortedProducts: Product[],
    type: string
}

const SortProducts: React.FC<ISortProductsProps> = ({ sortedProducts, type }) => {

    const { props } = usePage()

    const branch = props.branch as Branch
    const company = props.company as Company

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const updatedProducts = Array.from(products);
        const [reorderedItem] = updatedProducts.splice(result.source.index, 1);
        updatedProducts.splice(result.destination.index, 0, reorderedItem);

        const newProducts = updatedProducts.map((product, index) => ({
            ...product,
            seq: products[index].seq
        }));

        setProducts(newProducts);
    };

    const handleConfirmChange = async (products: Product[]) => {
        try {
            setLoading(true)

            const data = { products: products }
            await api.post(`/sort/products`, data)

            if (type === "category") {
                window.location.href = `/company/${company ? company.id : ""}/branch/${branch ? branch.id : ""}/products-categories`
            }

            if (type === "complement") {
                window.location.href = `/company/${company ? company.id : ""}/branch/${branch ? branch.id : ""}/complements-categories`
            }
        } catch (error) {
            console.error("Erro no handleConfirmChange: ", error)
        }
    }

    useEffect(() => {
        if (sortedProducts) {
            setProducts(sortedProducts);
        }
    }, [sortedProducts]);

    return (
        <div className="bg-gray-200 p-3 rounded-md w-full flex flex-col justify-between">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="products"
                    type="list"
                    direction="vertical"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {products.map((product, index) => (
                                <CardDroppable
                                    key={product._id}
                                    id={product._id}
                                    name={product.name}
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
                            onClick={() => handleConfirmChange(products)}
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

export default SortProducts