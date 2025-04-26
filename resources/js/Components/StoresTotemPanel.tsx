import {
    Branch,
    Company,
    Product,
    StoresTotemPanelFormOptions,
    TotemEfficiency,
    TotemUser
} from "@/utils/interfaces"
import ProgressBar from "./progressBar"
import React, { useState } from "react"
import progressiveBarColor from "@/utils/progressiveBarColor"

interface IStoresTotemPanelProps {
    company: Company,
    branch: Branch,
    totemEfficiency: TotemEfficiency[],
}

const StoresTotemPanel: React.FC<IStoresTotemPanelProps> = ({
    company,
    branch,
    totemEfficiency,
}) => {

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

    const filteredTotemEfficiency = totemEfficiency.filter(totem => {
        const search = filters.name.toLowerCase();
    
        const matchLoja = totem.name.toLowerCase().includes(search);
        const matchTotem = totem.totems.some(t => t.name.toLowerCase().includes(search));
    
        return !filters.name || matchLoja || matchTotem;
    });    

    const { active, inactive, total } = filteredTotemEfficiency.reduce((acc, item) => {
        item.totems.forEach(totem => {
            if (totem.active) {
                acc.active += 1;
            } else {
                acc.inactive += 1;
            }

            acc.total += 1
        });
        return acc;
    }, { active: 0, inactive: 0, total: 0})    

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-3 w-[35%]">
                    <h2>Status dos Totems</h2>
                    
                    <div className="flex flex-col gap-5 justify-between bg-gray-100 rounded p-3">
                        <ProgressBar
                            label="Totems Ativos"
                            current={active}
                            max={total}
                            color="#4CAF50"
                            type="opened"
                        />
                        
                        <ProgressBar
                            label="Totems Inativos"
                            current={inactive}
                            max={total}
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
                                placeholder="Busca por Loja"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <button
                                type="button"
                                className="text-white bg-black px-3 rounded h-10"
                            >Exportar</button>
                        </div>
                        
                        <div className="flex flex-row justify-between items-center px-1">
                            <span className="text-sm text-gray-500">
                                {filteredTotemEfficiency.length} de {total} Totems encontradas
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

                        <div className="grid grid-cols-[1.5fr_1fr_0.5fr_2fr_2fr] w-[99%] bg-gray-200 mx-auto rounded overflow-y-scroll">
                            <div className="contents font-bold border-b-2 border-b-gray-400">
                                <div className="p-[10px] flex justify-center">Loja</div>
                                <div className="p-[10px] flex justify-center">Totem</div>
                                <div className="p-[10px] flex justify-center">Status</div>
                                <div className="p-[10px] flex justify-center">Email</div>
                                <div className="p-[10px] flex justify-center">Funcionamento (%)</div>
                            </div>

                            {filteredTotemEfficiency.map(totemEfficiency => {

                                const totemData = totemEfficiency.totems;

                                return (
                                    <React.Fragment key={totemEfficiency.branch}>
                                        {totemData.map((totem, idx) => (
                                            <React.Fragment key={totem.totem || idx}>
                                                <div className={`py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400`}>
                                                    {totemEfficiency.name}
                                                </div>

                                                <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400">
                                                    {totem.name}
                                                </div>

                                                <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400">
                                                    {totem.active ? "Ativo" : "Inativo"}
                                                </div>

                                                <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400">
                                                    {totem.email}
                                                </div>

                                                <div className="py-[15px] flex justify-center bg-gray-200 border-b-2 border-b-gray-400 w-full">
                                                    <ProgressBar
                                                        current={totem.efficiency}
                                                        max={100}
                                                        color={progressiveBarColor(totem.efficiency)}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoresTotemPanel