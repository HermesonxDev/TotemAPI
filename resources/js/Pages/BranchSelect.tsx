import BranchOrCompanyCard from '@/Components/BranchOrCompanyCard';
import NavLink from '@/Components/NavLink';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Branch, Company } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';

interface IBranchSelectProps {
    company: Company,
    branches: Branch[]
}

export default function BranchSelect({ company, branches }: IBranchSelectProps) {
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {branches.map(branch =>
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
