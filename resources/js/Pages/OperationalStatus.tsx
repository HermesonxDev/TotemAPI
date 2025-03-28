import SideMenu from '@/Components/SideMenu';
import StatusOperationalMenu from '@/Components/StatusOperationalMenu';
import StoresMenuPanel from '@/Components/StoresMenuPanel';
import StoresPanel from '@/Components/StoresPanel';
import StoresTotemPanel from '@/Components/StoresTotemPanel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Branch, Company, Product, TotemUser } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';

interface IOperationalStatusProps {
    company: Company,
    branch: Branch,
    activatedLink: string,
    branches: Branch[],
    products: Product[],
    totems: TotemUser[]
}

export default function OperationalStatus({
    company,
    branch,
    activatedLink,
    branches,
    products,
    totems
}: IOperationalStatusProps) {

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
                    <div className="flex flex-col gap-5">

                        <div className="flex flex-col">
                            <h2 className="text-3xl font-medium">Status Operacional</h2>
                            <p>Confira o que está Acontecendo em suas Lojas neste exato momento.</p>
                        </div>

                        <StatusOperationalMenu
                            activatedLink={activatedLink}
                            company={company}
                            branch={branch}
                        />

                        {branches && branches.length > 0 &&
                            <StoresPanel
                                company={company}
                                branch={branch}
                                branches={branches}
                            />
                        }

                        {products && products.length > 0 &&
                            <StoresMenuPanel
                                company={company}
                                branch={branch}
                                products={products}
                            />
                        }

                        {totems && totems.length > 0 &&
                            <StoresTotemPanel
                                company={company}
                                branch={branch}
                                totems={totems}
                            />
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
