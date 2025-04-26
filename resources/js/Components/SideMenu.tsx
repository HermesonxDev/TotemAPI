import { Branch, BranchSubMenuOptions, Company } from "@/utils/interfaces"
import { useState } from "react"
import ResponsiveNavLink from "./ResponsiveNavLink"
import DropdownButton from "./DropdownButton"
import { Bell, Box, Circle, Coin, Config, Home, Panel } from '@/Components/icons';
import contains from "@/utils/contains";
import { usePage } from "@inertiajs/react";
import EditBranchModal from "./EditBranchModal/Index";
import api from "@/Services/api";

interface ISideMenuProps {
    company: Company,
    branch: Branch
}

const SideMenu: React.FC<ISideMenuProps> = ({ company, branch }) => {

    const user = usePage().props.auth.user;

    const [subMenus, setSubMenus] = useState<BranchSubMenuOptions>({
        itens: false,
        config: false
    })

    const handleMenusClick = (option: keyof BranchSubMenuOptions, value: boolean) => {
        setSubMenus({
            ...subMenus,
            [option]: value
        })
    }

    const [openEditBranchModal, setOpenEditBranchModal] = useState<boolean>(false)

    return (
        <div className="flex flex-col bg-white w-[10%]">
            <ResponsiveNavLink href="#">
                <Home />
                Inicio
            </ResponsiveNavLink>

            <ResponsiveNavLink href={`/company/${company.id}/branch/${branch.id}/order-panel`}>
                <Panel />
                Painel de Pedidos
            </ResponsiveNavLink>

            <DropdownButton>
                <Coin />
                Venda Mais
            </DropdownButton>

            <DropdownButton>
                <Bell />
                Pedidos
            </DropdownButton>

            <DropdownButton
                onClick={() => handleMenusClick('itens', !subMenus.itens)}
            >
                <Box />
                Itens
            </DropdownButton>

            {
                subMenus.itens && <>
                    <ResponsiveNavLink
                        href={`/company/${company.id}/branch/${branch.id}/products-categories`}
                        className="ml-[15px]"
                    >
                        <Circle />
                        Produtos
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                        href={`/company/${company.id}/branch/${branch.id}/complements-categories`}
                        className="ml-[15px]"
                    >
                        <Circle />
                        Complementos
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                        href={`/company/${company.id}/branch/${branch.id}`}
                        className="ml-[15px]"
                    >
                        <Circle />
                        Estoques
                    </ResponsiveNavLink>
                </>
            }

            <DropdownButton
                onClick={() => handleMenusClick('config', !subMenus.config)}
            >
                <Config />
                Configurações
            </DropdownButton>

            {
                subMenus.config && <>
                    <ResponsiveNavLink
                        href={`/company/${company.id}/branch/${branch.id}/operating-period`}
                        className="ml-[15px]"
                    >
                        <Circle />
                        Período de Funcionamento
                    </ResponsiveNavLink>

                    {contains(user.roles, "admin", "consultant")
                        ?
                            <ResponsiveNavLink
                                href={`/company/${company.id}/branch/${branch.id}/operational-status/stores`}
                                className="ml-[15px]"
                            >
                                <Circle />
                                Status Operacional
                            </ResponsiveNavLink>
                        :
                            <ResponsiveNavLink
                                href={`/company/${company.id}/branch/${branch.id}/operational-status/totem`}
                                className="ml-[15px]"
                            >
                                <Circle />
                                Status Operacional
                            </ResponsiveNavLink>
                    }
                    

                    {contains(user.roles, "admin", "consultant") &&
                        <>
                            <ResponsiveNavLink
                                href={`/company/${company.id}/branch/${branch.id}/menu-cloning`}
                                className="ml-[15px]"
                            >
                                <Circle />
                                Clonagem de Cardápio
                            </ResponsiveNavLink>

                            <button
                                className="flex w-full items-start border-l-4 py-2 pe-4 ps-3 border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 text-base font-medium transition duration-150 ease-in-out focus:outline-none ml-[15px]"
                                onClick={() => setOpenEditBranchModal(true)}
                            >
                                <Circle />
                                Config. da Unidade
                            </button>

                            <ResponsiveNavLink
                                href={`/company/${company.id}/branch/${branch.id}/integrations`}
                                className="ml-[15px]"
                            >
                                <Circle />
                                Integração
                            </ResponsiveNavLink>
                        </>
                    }
                </>
            }
            
            <EditBranchModal
                show={openEditBranchModal}
                editedBranch={branch}
                onClose={() => setOpenEditBranchModal(false)}
            />
        </div>
    )
}

export default SideMenu