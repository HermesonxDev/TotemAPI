import Loading from '@/Components/Loading';
import SelectWithLabel from '@/Components/SelectWithLabel';
import SideMenu from '@/Components/SideMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import api from '@/Services/api';
import formatDate from '@/utils/formatDate';
import { Branch, Company, CloningMenuForm, SelectOptions, TotemChargeHistory } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface IMenuCloningProps {
    company: Company,
    branch: Branch,
    totemChargesHistory: TotemChargeHistory[],
    options: SelectOptions[]
}

export default function MenuCloning({
    company,
    branch,
    totemChargesHistory,
    options
}: IMenuCloningProps) {

    const [formState, setFormState] = useState<CloningMenuForm>({
        originalBranch: '',
        destinationBranch: ''
    })

    const firstOptions = options.filter(option => option.value !== formState.destinationBranch)
    const secondOptions = options.filter(option => option.value !== formState.originalBranch)

    const [loading, setLoading] = useState<boolean>(false) 

    const handleChangeForm = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        key: keyof CloningMenuForm
    ) => {
        const { value } = event.target as HTMLInputElement

        setFormState((prev) => {
            return { ...prev, [key]: value }
        })
    }

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()
            setLoading(true)
            await api.post('/api/clone-menu', formState)
            window.location.reload()
        } catch (err: unknown) {
            setLoading(false);
            console.error("Erro no handleFormState: ", err);
        }
    }

    return (
        <AuthenticatedLayout
            PageName={branch.name}
            opened={branch.opened}
        >
            <Head title="Clonagem de Cardápio" />

            <div className="flex flex-row justify-between h-screen">

                <SideMenu
                    company={company}
                    branch={branch}
                />

                <div className="bg-white w-10/12 mx-auto mt-5 rounded-md p-4 overflow-scroll">
                    <div className="flex flex-col gap-12 h-full">

                        <div className="flex flex-col">
                            <h2 className="text-3xl font-medium">Clonagem de Cardápios</h2>
                            <p>Replique o Cardápio de uma Loja em outra com mais Praticidade.</p>
                        </div>

                        <form className="flex flex-col justify-between" onSubmit={handleFormState}>
                            <div className="flex flex-row gap-5 w-full">
                                <SelectWithLabel
                                    label="Loja de Origem"
                                    value={formState.originalBranch}
                                    onChange={(e) => handleChangeForm(e, 'originalBranch')}
                                    options={firstOptions}
                                    required
                                />

                                <SelectWithLabel
                                    label="Loja de Destino"
                                    value={formState.destinationBranch}
                                    onChange={(e) => handleChangeForm(e, 'destinationBranch')}
                                    options={secondOptions}
                                    required
                                />
                            </div>

                            {!loading
                                ?
                                <button
                                    className="text-white bg-black px-3 py-2 rounded"
                                    onClick={() => {}}
                                >Clonar</button>
                                : <Loading marginTop='0'/>
                            }
                        </form>

                        <div className='flex flex-col gap-5'>
                            <h2 className="text-3xl font-medium">Histórico</h2>

                            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] w-[99%] bg-gray-200 rounded overflow-y-scroll">
                                <div className="contents font-bold border-b-2 border-b-gray-400">
                                    <div className="p-[10px] flex justify-center">Data</div>
                                    <div className="p-[10px] flex justify-center">Origem</div>
                                    <div className="p-[10px] flex justify-center">Destino</div>
                                    <div className="p-[10px] flex justify-center">Status</div>
                                    <div className="p-[10px] flex justify-center">Tempo</div>
                                </div>

                                {totemChargesHistory.map(totemChargesHistory => (
                                    <div className="contents" key={branch.id}>
                                        <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                            {formatDate(totemChargesHistory.createdAt)}
                                        </div>

                                        <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                            {totemChargesHistory.to}
                                        </div>

                                        <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                            {totemChargesHistory.from}
                                        </div>

                                        <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                            {totemChargesHistory.status === 'done' ? 'Concluído' : 'Executando'}
                                        </div>

                                        <div className="py-[15px] flex justify-center bg-gray-200 items-center border-b-2 border-b-gray-400">
                                            {totemChargesHistory.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
