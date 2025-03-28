import { Draggable } from "@hello-pangea/dnd"

interface ICardDroppableProps {
    id: string,
    name: string,
    index: number
}

const CardDroppable: React.FC<ICardDroppableProps> = ({ id, name, index }) => {
    return(
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="w-full bg-zinc-300 mb-2 last:mb-0 px-2 py-3 rounded border-[2px] border-zinc-400"
                >
                    <p className="font-medium">{name}</p>
                </div>
            )}
        </Draggable>
    )
}

export default CardDroppable