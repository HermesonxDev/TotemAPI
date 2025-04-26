import CreatePeriodModal from '@/Components/CreatePeriodModal/Index';
import DeleteModal from '@/Components/DeleteModal/Index';
import EditPeriodModal from '@/Components/EditPeriodModal/Index';
import Loading from '@/Components/Loading';
import SideMenu from '@/Components/SideMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import api from '@/Services/api';
import { Branch, PeriodModals, Company, Period } from '@/utils/interfaces';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface IOperatingPeriodProps {
    company: Company,
    branch: Branch
}

export default function OperatingPeriod({
    company,
    branch
}: IOperatingPeriodProps) {

    const { props } = usePage()

    const [modals, setModals] = useState<PeriodModals>({
        create: false,
        edit: false,
        delete: false
    })
    
    const [periods, setPeriods] = useState<Period[]>([])
    const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const currentBranch = props.branch as Branch

    const handleModalsClick = (option: keyof PeriodModals, value: boolean) => {
        setModals({
            create: false,
            edit: false,
            delete: false,
            [option]: value
        })
    }

    const selectPeriodModal = (id: string, type: string) => {
        let selectedPeriod

        if (type === 'edit') {
            selectedPeriod = periods.find(period => period._id === id)
            setSelectedPeriod(selectedPeriod || null)
            handleModalsClick('edit', true)
        }
        
        if (type === 'delete') {
            selectedPeriod = periods.find(period => period._id === id)
            setSelectedPeriod(selectedPeriod || null)
            handleModalsClick('delete', true)
        }
    }

    useEffect(() => {
        const getPeriods = async () => {
            try {
                setLoading(true)

                const response = await api.get(`/api/periods?branch=${currentBranch.id}`)
                const periods = response.data.data
                setPeriods(periods)
            } catch (error) {
                console.error("Erro ao Buscar Períodos:", error)
            } finally {
                setLoading(false)
            }
        }

        getPeriods()
    }, [props.branch])

    return (
        <AuthenticatedLayout
            PageName={branch.name}
            opened={branch.opened}
        >
            <Head title="Status Operacional" />

            <div className="flex flex-row justify-between h-screen">

                <SideMenu
                    company={company}
                    branch={branch}
                />

                <div className="bg-white w-10/12 mx-auto mt-5 rounded-md p-4 overflow-scroll">
                    <button
                        className="text-white bg-black px-3 py-1 rounded"
                        onClick={() => handleModalsClick('create', true)}
                    >Adicionar Novo Período</button>

                    {!loading ?
                        <div className="flex flex-col gap-3 mt-3">
                            {periods.map(period => (
                                <div className="flex flex-row items-center justify-between bg-gray-100 h-14 rounded p-3 mb-1" key={period._id}>
                                    <h2>{period.title}</h2>
        
                                    <div className="flex flex-row items-center justify-between gap-2">
                                        <button
                                            className="text-white bg-black px-3 py-1 rounded"
                                            onClick={() => selectPeriodModal(period._id, 'edit')}
                                        >Editar</button>
        
                                        <button
                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                            onClick={() => selectPeriodModal(period._id, 'delete')}
                                        >Excluir</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        : <Loading />
                    }
                </div>

                <CreatePeriodModal
                    show={modals.create}
                    onClose={() => handleModalsClick('create', false)}
                />
                
                <EditPeriodModal
                    show={modals.edit}
                    editedPeriod={selectedPeriod}
                    onClose={() => handleModalsClick('edit', false)}
                />

                <DeleteModal
                    show={modals.delete}
                    url="/delete/period"
                    deletedEntity={selectedPeriod}
                    onClose={() => handleModalsClick('delete', false)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
