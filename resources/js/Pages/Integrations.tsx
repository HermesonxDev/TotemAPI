
import GridBodyItem from '@/Components/GridBodyItem';
import GridBodyRow from '@/Components/GridBodyRow';
import GridContainer from '@/Components/GridContainer';
import GridHeaderItem from '@/Components/GridHeaderItem';
import GridHeaderRow from '@/Components/GridHeaderRow';
import Loading from '@/Components/Loading';
import SideMenu from '@/Components/SideMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import api from '@/Services/api';
import { ApiKey, Branch, Company, Period } from '@/utils/interfaces';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface IIntegrationsProps {
    company: Company,
    branch: Branch,
    apiKeys: ApiKey[]
}

export default function Integrations({
    company,
    branch,
    apiKeys
}: IIntegrationsProps) {

    const { props } = usePage()
    
    const [periods, setPeriods] = useState<Period[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const currentBranch = props.branch as Branch

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
                    
                    <h2 className="p-4 text-3xl font-bold">Chaves de Integração</h2>

                    <GridContainer>
                        <GridHeaderRow
                            gridCols="grid-cols-[1fr_3fr_1fr]"
                            background="gray-800"
                        >
                            <GridHeaderItem padding="p-2">Nome</GridHeaderItem>
                            <GridHeaderItem padding="p-2">Chave</GridHeaderItem>
                            <GridHeaderItem padding="p-2">Ações</GridHeaderItem>
                        </GridHeaderRow>

                        {apiKeys.map(apiKey => (
                            <GridBodyRow
                                key={apiKey.id}
                                gridCols="grid-cols-[1fr_3fr_1fr]"
                                background="gray-200"
                            >
                                <GridBodyItem padding="p-3">{apiKey.name}</GridBodyItem>
                                <GridBodyItem
                                    padding="p-3"
                                    className="truncate overflow-hidden whitespace-nowrap"
                                >
                                    {apiKey.key}
                                </GridBodyItem>
                                <GridBodyItem padding="p-2">
                                    <button
                                        type="button"
                                        className="text-white bg-black px-3 py-1 rounded"
                                        onClick={() => {
                                            navigator.clipboard.writeText(apiKey.key)
                                                .then(() => {
                                                    alert('Chave copiada com sucesso!');
                                                })
                                                .catch((err) => {
                                                    console.error('Erro ao copiar chave:', err);
                                                });
                                        }}
                                    >Copiar</button>
                                </GridBodyItem>
                            </GridBodyRow>
                        ))}
                    </GridContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
