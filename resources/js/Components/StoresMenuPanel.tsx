import {
    Branch,
    Company,
    InactiveProductsBranches,
    Product,
    ProductSummary,
    StoresMenuPanelFormOptions,
} from "@/utils/interfaces"
import ProgressBar from "./progressBar"
import { useState } from "react"
import InactiveProductsModal from "./InactiveProductsModal"

interface IStoresMenuPanelProps {
    company: Company,
    branch: Branch,
    products: Product[]
}

const StoresMenuPanel: React.FC<IStoresMenuPanelProps> = ({ company, branch, products }) => {

    const summarizeProducts = (products: Product[]): ProductSummary[] => {
        const productMap = new Map<string, { id: string; name: string; code: string; activeIn: string[]; inactiveIn: string[] }>();
      
        products.forEach(({ id, name, code, branch, active }) => {
          if (!productMap.has(name)) {
            productMap.set(name, { id, name, code, activeIn: [], inactiveIn: [] });
          }
      
          const productStats = productMap.get(name)!;
      
          if (active) {
            if (!productStats.activeIn.includes(branch)) {
              productStats.activeIn.push(branch);
            }
          } else {
            if (!productStats.inactiveIn.includes(branch)) {
              productStats.inactiveIn.push(branch);
            }
          }
        });
      
        return Array.from(productMap.values()).map(({ id, name, code, activeIn, inactiveIn }) => ({
          id,
          name,
          code,
          activeIn,
          inactiveIn,
        }));
      };      

    const formattedProducts = summarizeProducts(products)

    const [inactiveProductsBranches, setInactiveProductsBranches] = useState<InactiveProductsBranches | null>(null)
    const [showInactiveProductsModal, setShowInactiveProductsModal] = useState<boolean>(false)

    const [filters, setFilters] = useState<StoresMenuPanelFormOptions>({
        name: "",
        pdvCode: ""
    })


    const handleChangeFilters = (
        event: React.ChangeEvent<HTMLInputElement>,
        key: keyof StoresMenuPanelFormOptions
    ) => {
        const { value } = event.target as HTMLInputElement;

        setFilters((prev) => {
            const updatedState = { ...prev, [key]: value };

            return updatedState;
        });
    };

    const filteredProducts = formattedProducts.filter(product => {
        if (filters.name && !product.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        
        if (filters.pdvCode && !product.code.toLowerCase().includes(filters.pdvCode.toLowerCase())) {
            return false;
        }
        
        return true;
    });

    let activeProducts = 0;
    let inactiveProducts = 0;

    formattedProducts.forEach(product => {
        activeProducts += product.activeIn.length
        inactiveProducts += product.inactiveIn.length
    });

    const openInactiveProductsModal = (name: string, inactiveProductsBranches: string[]) => {
        setInactiveProductsBranches({
            name: name,
            branches: inactiveProductsBranches
        })
        setShowInactiveProductsModal(true)
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-3 w-[35%]">
                    <h2>Status do Cardápio</h2>
                    
                    <div className="flex flex-col gap-5 justify-between bg-gray-100 rounded p-3">
                        <ProgressBar
                            label="Produtos Ativos"
                            current={activeProducts}
                            max={products.length}
                            color="#4CAF50"
                            type="opened"
                        />
                        
                        <ProgressBar
                            label="Produtos Inativos"
                            current={inactiveProducts}
                            max={products.length}
                            color="#FB923C"
                            type="closed"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-[62%]">
                    <h2>Produtos</h2>
                    
                    <div className="flex flex-col gap-5 bg-gray-100 rounded p-3 h-[680px]">
                        <div className="flex flex-row gap-3 items-center">
                            <input
                                type="text"
                                onChange={(e) => handleChangeFilters(e, 'name')}
                                placeholder="Busca por Nome"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <input
                                type="text"
                                onChange={(e) => handleChangeFilters(e, 'pdvCode')}
                                placeholder="Busca por Código PDV"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <button
                                type="button"
                                className="text-white bg-black px-3 rounded h-10"
                            >Exportar</button>
                        </div>
                        
                        <div className="flex flex-row justify-between items-center px-1">
                            <span className="text-sm text-gray-500">
                                {filteredProducts.length} de {formattedProducts.length} produtos encontradas
                            </span>
                            {(filters.name || filters.pdvCode) && (
                                <button
                                    onClick={() => setFilters({ name: "", pdvCode: ""})}
                                    className="text-gray-500 hover:bg-red-600 hover:text-white px-3 py-1 rounded"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] w-[99%] bg-gray-200 mx-auto rounded overflow-y-scroll">
                            <div className="contents font-bold border-b-2 border-b-gray-400">
                                <div className="p-[10px] flex justify-center">Item</div>
                                <div className="p-[10px] flex justify-center">Cód. PDV</div>
                                <div className="p-[10px] flex justify-center">Ativo em</div>
                                <div className="p-[10px] flex justify-center">Inativo em</div>
                            </div>

                            {filteredProducts.map(product => 
                                <div className="contents" key={product.id}>
                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {product.name}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {product.code}
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {product.activeIn.length} Lojas
                                    </div>

                                    <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                        {product.inactiveIn.length > 0 ?
                                            <button
                                                className="text-white bg-green-600 hover:bg-green-700 px-10 py-1 rounded"
                                                onClick={() => openInactiveProductsModal(product.name, product.inactiveIn)}
                                            >Ver</button>
                                            :
                                            <button
                                                className="text-white bg-green-900 px-10 py-1 rounded"
                                                disabled
                                            >Ver</button>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <InactiveProductsModal
                show={showInactiveProductsModal}
                inactiveProductsBranches={inactiveProductsBranches}
                onClose={() => setShowInactiveProductsModal(false)}
            />
        </div>
    )
}

export default StoresMenuPanel