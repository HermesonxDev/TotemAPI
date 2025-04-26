import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import CardDroppable from "./CardDroppable"
import { Complement } from "@/utils/interfaces"
import api from "@/Services/api";
import { Link, usePage } from "@inertiajs/react"
import Loading from "./Loading";

interface ISortComplementGroupProps {
    sortedComplementsGroups: Complement[],
    branch: string,
    company: string | undefined
}

const SortComplementGroup: React.FC<ISortComplementGroupProps> = ({ sortedComplementsGroups, branch, company }) => {

    const { props } = usePage()

    const [complementsGroups, setComplementGroups] = useState<Complement[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const updatedComplementsGroups = Array.from(complementsGroups);
        const [reorderedItem] = updatedComplementsGroups.splice(result.source.index, 1);
        updatedComplementsGroups.splice(result.destination.index, 0, reorderedItem);

        const newComplementsGroups = updatedComplementsGroups.map((product, index) => ({
            ...product,
            seq: complementsGroups[index].seq
        }));

        setComplementGroups(newComplementsGroups);
    };

    const handleConfirmChange = async (complementsGroups: Complement[]) => {
        try {
            setLoading(true)

            const data = { complementsGroups: complementsGroups }
            await api.post(`/sort/complements-groups`, data)
            window.location.href = `/company/${company}/branch/${branch}/complements-categories`
        } catch (error) {
            console.error("Erro no handleConfirmChange: ", error)
        }
    }

    useEffect(() => {
        if (sortedComplementsGroups) {
            setComplementGroups(sortedComplementsGroups);
        }
    }, [sortedComplementsGroups]);

    return (
        <div className="bg-gray-200 p-3 rounded-md w-full flex flex-col justify-between">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="complementsGroups"
                    type="list"
                    direction="vertical"
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {complementsGroups.map((complement, index) => (
                                <CardDroppable
                                    key={complement._id}
                                    id={complement._id}
                                    name={complement.title}
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
                            onClick={() => handleConfirmChange(complementsGroups)}
                        >Confirmar</button>

                        <Link
                            className="text-white bg-red-600 px-3 py-1 rounded"
                            href={`/company/${company}/branch/${branch}/complements-categories`}
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

export default SortComplementGroup