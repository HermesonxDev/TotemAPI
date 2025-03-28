import SideMenu from '@/Components/SideMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Branch, Company } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';

interface IOperatingPeriodProps {
    company: Company,
    branch: Branch
}

export default function OperatingPeriod({
    company,
    branch
}: IOperatingPeriodProps) {

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
                
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
