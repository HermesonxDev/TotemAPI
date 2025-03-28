import { Branch, Company, StoresPanelFormOptions } from "@/utils/interfaces"
import ProgressBar from "./progressBar"
import { useState } from "react"

interface IStoresPanelProps {
    company: Company,
    branch: Branch,
    branches: Branch[]
}

const StoresPanel: React.FC<IStoresPanelProps> = ({ company, branch, branches }) => {

    const [filters, setFilters] = useState({
        name: "",
        status: "",
        time: ""
    })

    const handleChangeFilters = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof StoresPanelFormOptions
    ) => {
        const { value } = event.target as HTMLInputElement;

        setFilters((prev) => {
            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const openedStores = branches.filter(branch => branch.opened).length
    const closedStores = branches.filter(branch => !branch.opened).length

    const filteredBranches = branches.filter(branch => {
        if (filters.name && !branch.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        
        if (filters.status) {
            const status = filters.status.toLowerCase();
            if (status === 'true' && !branch.opened) return false;
            if (status === 'false' && branch.opened) return false;
        }
        
        return true;
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-3 w-[35%]">
                    <h2>Status das lojas</h2>
                    
                    <div className="flex flex-col gap-5 justify-between bg-gray-100 rounded p-3">
                        <ProgressBar
                            label="Abertos"
                            current={openedStores}
                            max={branches.length}
                            color="#4CAF50"
                            type="opened"
                        />
                        
                        <ProgressBar
                            label="Fechados"
                            current={closedStores}
                            max={branches.length}
                            color="#FB923C"
                            type="closed"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-[62%]">
                    <h2>Lojas</h2>
                    
                    <div className="flex flex-col gap-5 bg-gray-100 rounded p-3 h-[650px]">
                        <div className="flex flex-row gap-3 items-center">
                            <input
                                type="text"
                                onChange={(e) => handleChangeFilters(e, 'name')}
                                placeholder="Busca por Nome"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <select 
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.status}
                                onChange={(e) => handleChangeFilters(
                                    {target: {value: e.target.value}} as React.ChangeEvent<HTMLInputElement>,
                                    'status'
                                )}
                            >
                                <option value="">Todos os status</option>
                                <option value="true">Aberto</option>
                                <option value="false">Fechado</option>
                            </select>

                            <select 
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.time}
                                onChange={(e) => handleChangeFilters(
                                    {target: {value: e.target.value}} as React.ChangeEvent<HTMLInputElement>,
                                    'time'
                                )}
                            >
                                <option value="">Todos os Horários</option>
                                <option value="10:00">10:00</option>
                                <option value="12:00">12:00</option>
                                <option value="15:00">15:00</option>
                            </select>

                            <button
                                type="button"
                                className="text-white bg-black px-3 rounded h-10"
                            >Exportar</button>
                        </div>
                        
                        <div className="flex flex-row justify-between items-center px-1">
                            <span className="text-sm text-gray-500">
                                {filteredBranches.length} de {branches.length} lojas encontradas
                            </span>
                            {(filters.name || filters.status || filters.time) && (
                                <button
                                    onClick={() => setFilters({ name: "", status: "", time: "" })}
                                    className="text-gray-500 hover:bg-red-600 hover:text-white px-3 py-1 rounded"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-[1fr_1fr_1fr] w-[99%] bg-gray-200 mx-auto rounded overflow-y-scroll">
                            <div className="contents font-bold border-b-2 border-b-gray-400">
                                <div className="p-[10px] flex justify-center">Loja</div>
                                <div className="p-[10px] flex justify-center">Status</div>
                                <div className="p-[10px] flex justify-center">Funcionamento</div>
                            </div>

                            {filteredBranches.map(branch => 
                                <div className="contents" key={branch.id}>
                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {branch.name}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {branch.opened ? "Aberto" : "Fechado"}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        Quinta-feira, das 10:00 às 21:45
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

export default StoresPanel