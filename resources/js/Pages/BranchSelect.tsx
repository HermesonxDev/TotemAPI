import BranchOrCompanyCard from '@/Components/BranchOrCompanyCard';
import NavLink from '@/Components/NavLink';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Branch, Company } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface IBranchSelectProps {
    company: Company,
    branches: Branch[]
}

export default function BranchSelect({ company, branches }: IBranchSelectProps) {

    const [filters, setFilters] = useState<{ name: string }>({
            name: ''
        })
    
    const filteredBranches = branches.filter(branch => {
        if (filters.name && !branch.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false
        }
        
        return true
    });

    const handleChangeFilters = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof { name: string }
    ) => {
        const { value } = event.target as HTMLInputElement

        setFilters((prev) => {
            const updatedState = { ...prev, [key]: value }

            return updatedState
        })
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Selecione a Unidade Que Deseja Acessar
                </h2>
            }
        >
            <Head title="Unidades" />

            <div className="py-12">
                <div className="flex flex-col gap-5 mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <input
                        type="text"
                        onChange={(e) => handleChangeFilters(e, 'name')}
                        placeholder="Busca por Nome"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {filteredBranches.map(branch =>
                            <div key={branch.id} className="flex flex-row justify-between p-6">
                                <BranchOrCompanyCard
                                    key={branch.id}
                                    name={branch.name}
                                    street={branch.location.address.street}
                                    number={branch.location.address.number}
                                    neighborhood={branch.location.address.neighborhood}
                                    state={branch.location.address.state}
                                />

                                <NavLink href={`/company/${company.id}/branch/${branch.id}`}>
                                    Acessar
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
