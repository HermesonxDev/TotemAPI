import { InactiveProductsBranches } from "@/utils/interfaces"
import Modal from "./Modal"
import { useEffect, useState } from "react"
import api from "@/Services/api"
import Loading from "./Loading"

interface IInactiveProductsModalProps {
    inactiveProductsBranches: InactiveProductsBranches | null,
    show: boolean,
    onClose(): void
}

const InactiveProductsModal: React.FC<IInactiveProductsModalProps> = ({ inactiveProductsBranches, show, onClose }) => {

    const [branches, setBranches] = useState<string[]>([]);
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [queryLoading, setqueryLoading] = useState<boolean>(false);

    const handleActive = async (name: string | undefined, branch: string | undefined) => {
        try {
            setqueryLoading(true)
            const data = { name: name, branch: branch }
            await api.post('/status/active', data)
            window.location.reload()
        } catch (error) {
            setqueryLoading(false)
            console.error("Erro no handleActive: ", error)
        }
    }

    useEffect(() => {
        const getBranches = async () => {
            setPageLoading(true);

            try {
                const responses = await Promise.all(
                    inactiveProductsBranches?.branches.map(async (branchId) => {
                        const response = await api.get(`/api/branches?_id=${branchId}`);
                        return response.data.data[0]?.name;
                    }) || []
                );
                setBranches(responses.filter(Boolean));
            } catch (error) {
                console.error("Erro ao buscar lojas:", error);
            } finally {
                setPageLoading(false);
            }
        };

        if (inactiveProductsBranches) {
            getBranches();
        }
    }, [inactiveProductsBranches]);

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col gap-3 p-4 h-[600px]">
                <h2 className="font-bold text-xl">Produto Inativo nas Seguintes Lojas</h2>

                <div className="flex flex-col gap-3 overflow-x-scroll h-full">
                    {pageLoading ? (
                        <div>Carregando...</div>
                    ) : (
                        branches.map((branchName, index) => (
                            <div
                                key={index}
                                className="flex flex-row items-center justify-between bg-gray-100 h-14 rounded p-3 mb-1"
                            >
                                <h2>{branchName}</h2>

                                {!queryLoading ?
                                    <button
                                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                                        onClick={() => handleActive(inactiveProductsBranches?.name, inactiveProductsBranches?.branches[index])}
                                    >
                                        Ativar
                                    </button>
                                    : <Loading width="45px" marginTop="0"/>
                                }
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default InactiveProductsModal;