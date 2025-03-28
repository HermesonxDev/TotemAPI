import CreateBranchModal from '@/Components/CreateBranchModal/Index';
import CreateCompanyModal from '@/Components/CreateCompanyModal/Index';
import CreateTotemUserModal from '@/Components/CreateTotemUserModal/Index';
import CreateUserModal from '@/Components/CreateUserModal/Index';
import Dropdown from '@/Components/Dropdown';
import DropdownButton from '@/Components/DropdownButton';
import { Logo } from '@/Components/icons';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { LayoutModals } from '@/utils/interfaces';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
    PageName,
    opened
}: PropsWithChildren<{
    header?: ReactNode,
    PageName?: string,
    opened?: boolean
}>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    const [modals, setModals] = useState<LayoutModals>({
        user: false,
        totemUser: false,
        branch: false,
        company: false
    })

    const handleModalsClick = (option: keyof LayoutModals, value: boolean) => {
        setModals({
            user: false,
            totemUser: false,
            branch: false,
            company: false,
            [option]: value
        })
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <Logo />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-2 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    {PageName
                                        ? opened
                                            ? `${PageName} - (Aberto)`
                                            : `${PageName} - (Fechado)`
                                        : "Dashboard"
                                    }
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Perfil
                                        </Dropdown.Link>

                                        <DropdownButton
                                            onClick={() => handleModalsClick('user', true)}
                                            fontSize="text-sm"
                                        > Cadastrar Usuário </DropdownButton>

                                        <DropdownButton
                                            onClick={() => handleModalsClick('totemUser', true)}
                                            fontSize="text-sm"
                                        > Cadastrar Usuário Totem</DropdownButton>

                                        <DropdownButton
                                            onClick={() => handleModalsClick('company', true)}
                                            fontSize="text-sm"
                                        > Cadastrar Franquia </DropdownButton>

                                        <DropdownButton
                                            onClick={() => handleModalsClick('branch', true)}
                                            fontSize="text-sm"
                                        > Cadastrar Unidade </DropdownButton>

                                        <Dropdown.Link href="/dashboard">
                                            Mudar Franquia
                                        </Dropdown.Link>

                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        > Deslogar </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            {PageName
                                ? opened
                                    ? `${PageName} - (Aberto)`
                                    : `${PageName} - (Fechado)`
                                : "Dashboard"
                            }
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Perfil
                            </ResponsiveNavLink>

                            <DropdownButton
                                onClick={() => handleModalsClick('user', true)}
                                fontSize="text-sm"
                            > Cadastrar Usuário </DropdownButton>

                            <DropdownButton
                                onClick={() => handleModalsClick('totemUser', true)}
                                fontSize="text-sm"
                            > Cadastrar Usuário Totem</DropdownButton>

                            <DropdownButton
                                onClick={() => handleModalsClick('company', true)}
                                fontSize="text-sm"
                            > Cadastrar Franquia </DropdownButton>

                            <DropdownButton
                                onClick={() => handleModalsClick('branch', true)}
                                fontSize="text-sm"
                            > Cadastrar Unidade </DropdownButton>

                            <ResponsiveNavLink href="/dashboard">
                                Mudar Franquia
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            > Deslogar </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            <CreateCompanyModal
                show={modals.company}
                onClose={() =>  handleModalsClick('company', false)}
            />

            <CreateBranchModal
                show={modals.branch}
                onClose={() => handleModalsClick('branch', false)}
            />

            <CreateUserModal
                show={modals.user}
                onClose={() => handleModalsClick('user', false)}
            />

            <CreateTotemUserModal
                show={modals.totemUser}
                onClose={() => handleModalsClick('totemUser', false)}
            />
        </div>
    );
}
