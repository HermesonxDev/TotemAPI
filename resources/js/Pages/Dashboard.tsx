import BranchOrCompanyCard from '@/Components/BranchOrCompanyCard';
import NavLink from '@/Components/NavLink';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';

interface IDashboardProps {
    companies: Company[]
}

export default function Dashboard({ companies }: IDashboardProps) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Selecione a Franquia Que Deseja Acessar
                </h2>
            }
        >
            <Head title="Franquias" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {companies.map(company =>
                            <div key={company.id} className="flex flex-row justify-between p-6">
                                <BranchOrCompanyCard
                                    key={company.id}
                                    name={company.name}
                                    slug={company.slug}
                                />

                                <NavLink href={`/branch-select/${company.id}`}>
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
