import {
    Branch,
    Company,
    Product,
    StoresTotemPanelFormOptions,
    TotemUser
} from "@/utils/interfaces"
import ProgressBar from "./progressBar"
import { useState } from "react"

interface IStoresTotemPanelProps {
    company: Company,
    branch: Branch,
    totems: TotemUser[]
}

const StoresTotemPanel: React.FC<IStoresTotemPanelProps> = ({ company, branch, totems }) => {

    const [filters, setFilters] = useState<StoresTotemPanelFormOptions>({
        name: "",
    })

    const handleChangeFilters = (
        event: React.ChangeEvent<HTMLInputElement>,
        key: keyof StoresTotemPanelFormOptions
    ) => {
        const { value } = event.target as HTMLInputElement;

        setFilters((prev) => {
            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const filteredTotems = totems.filter(totem => {
        if (filters.name && !totem.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        
        return true;
    });

    let activeTotems = 0;
    let inactiveTotems = 0;

    totems.forEach(totem => {
        if (totem.active === true) {
            activeTotems += 1
        } else {
            inactiveTotems += 1
        }
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-3 w-[35%]">
                    <h2>Status dos Totems</h2>
                    
                    <div className="flex flex-col gap-5 justify-between bg-gray-100 rounded p-3">
                        <ProgressBar
                            label="Totems Ativos"
                            current={activeTotems}
                            max={totems.length}
                            color="#4CAF50"
                            type="opened"
                        />
                        
                        <ProgressBar
                            label="Totems Inativos"
                            current={inactiveTotems}
                            max={totems.length}
                            color="#FB923C"
                            type="closed"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-[62%]">
                    <h2>Totems</h2>
                    
                    <div className="flex flex-col gap-5 bg-gray-100 rounded p-3 h-[680px]">
                        <div className="flex flex-row gap-3 items-center">
                            <input
                                type="text"
                                onChange={(e) => handleChangeFilters(e, 'name')}
                                placeholder="Busca por Nome"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <button
                                type="button"
                                className="text-white bg-black px-3 rounded h-10"
                            >Exportar</button>
                        </div>
                        
                        <div className="flex flex-row justify-between items-center px-1">
                            <span className="text-sm text-gray-500">
                                {filteredTotems.length} de {totems.length} Totems encontradas
                            </span>
                            {(filters.name) && (
                                <button
                                    onClick={() => setFilters({ name: ""})}
                                    className="text-gray-500 hover:bg-red-600 hover:text-white px-3 py-1 rounded"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-[1fr_1fr_1fr] w-[99%] bg-gray-200 mx-auto rounded overflow-y-scroll">
                            <div className="contents font-bold border-b-2 border-b-gray-400">
                                <div className="p-[10px] flex justify-center">Totem</div>
                                <div className="p-[10px] flex justify-center">Status</div>
                                <div className="p-[10px] flex justify-center">Email</div>
                            </div>

                            {filteredTotems.map(totem => 
                                <div className="contents" key={totem.id}>
                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {totem.name}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {totem.active ? "Ativo" : "Inativo"}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {totem.email}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoresTotemPanel