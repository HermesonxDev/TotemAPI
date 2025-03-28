import { TfiTimer } from "react-icons/tfi";
import handleStatusColor from "@/utils/handleStatusColor";
import handleTitleCard from "@/utils/handleTitleCard";
import { Order } from "@/utils/interfaces";
import handleLocationType from "@/utils/handleLocationType";

interface IOrderBoxProps {
    data: Order,
    hiddenSubInformations?: boolean,
    onClick(): void
}

const OrderBox: React.FC<IOrderBoxProps> = ({ data, hiddenSubInformations, onClick }) => (
    <div
        className="w-full h-12 flex rounded-sm flex-row relative justify-between p-2 bg-gray-300 transition duration-300 shadow-md hover:border hover:border-white hover:bg-gray-400 hover:scale-105 cursor-pointer"
        onClick={onClick}
    >
        <div className="flex flex-col gap-0.5">
            <h4 className="text-black">#{data.seq} {data.totemClientName || "N/A"}</h4>
            <p className="text-sm text-black opacity-70 truncate max-w-[19rem] md:max-w-[14rem] lg:max-w-[12.8rem]">
                {handleLocationType(data.locationType) || "Endereço não disponível"}
            </p>
        </div>

        {!hiddenSubInformations && (
            <div className="flex flex-col items-end gap-1 relative">
                <p className="absolute flex items-center gap-1 text-black right-2 top-0.5">
                    <TfiTimer className="text-black" /> 5min
                </p>
                <div className="absolute right-1 bottom-1 flex flex-row gap-1">
                    <p className={`text-white text-sm rounded-sm py-0.5 px-1 h-5 flex items-center`} style={{ backgroundColor: handleStatusColor(data.status) }}>
                        {handleTitleCard(data.status)}
                    </p>
                </div>
            </div>
        )}
    </div>
)

export default OrderBox;
