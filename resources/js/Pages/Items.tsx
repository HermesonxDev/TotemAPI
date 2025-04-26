import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Branch, Category, Company, Complement, Product } from '@/utils/interfaces';
import { Head } from '@inertiajs/react';
import CategoryAndComplementList from '@/Components/CategoryAndComplementList';
import KDS from '@/Components/KDS';
import SideMenu from '@/Components/SideMenu';

interface IItemsProps {
    branch: Branch,
    company: Company,
    categories?: Category[],
    complements?: Complement[],
    orders?: any[],
    categoryID?: string,
    categoriesProducts?: Product[],
    sortCategoryProducts?: Product[],
    categoriesComplements?: Complement[],
    complementID?: string,
    complementsProducts?: Product[],
    sortComplementsProducts?: Product[],
}

export default function Items({
    branch,
    company,
    categories,
    complements,
    orders,
    categoryID,
    categoriesProducts,
    sortCategoryProducts,
    categoriesComplements,
    complementID,
    complementsProducts,
    sortComplementsProducts
}: IItemsProps) {

    return (
        <AuthenticatedLayout
            PageName={branch.name}
            opened={branch.opened}
        >
            <Head title={branch.name} />

            <div className="flex flex-row justify-between h-screen">

                <SideMenu
                    company={company}
                    branch={branch}
                />

                {categories && categories.length > 0 &&
                    <div className="bg-white w-10/12 mx-auto mt-5 rounded-md p-4 overflow-scroll">
                        <CategoryAndComplementList
                            branch={branch.id}
                            company={company.id}
                            categories={categories}
                            categoriesProducts={categoriesProducts}
                            sortCategoriesProducts={sortCategoryProducts}
                            categoriesComplements={categoriesComplements}
                        />
                    </div>
                }

                {complements && complements.length > 0 &&
                    <div className="bg-white w-10/12 mx-auto mt-5 rounded-md p-4 overflow-scroll">
                        <CategoryAndComplementList
                            branch={branch.id}
                            company={company.id}
                            complements={complements}
                            complementsProducts={complementsProducts}
                            sortComplementsProducts={sortComplementsProducts}
                        />
                    </div>
                }

                {orders && orders.length > 0 &&
                    <div className="bg-white w-10/12 mx-auto mt-5 rounded-md p-4 overflow-scroll">
                        <KDS orders={orders} />
                    </div>
                }
            </div>
        </AuthenticatedLayout>
    );
}
