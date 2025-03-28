import { Branch, BranchSubMenuOptions, Company } from "@/utils/interfaces"
import { useState } from "react"
import ResponsiveNavLink from "./ResponsiveNavLink"
import DropdownButton from "./DropdownButton"
import { Bell, Box, Circle, Coin, Config, Home, Panel } from '@/Components/icons';

interface ISideMenuProps {
    company: Company,
    branch: Branch
}

const SideMenu: React.FC<ISideMenuProps> = ({ company, branch }) => {

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

                    <ResponsiveNavLink
                        href={`/company/${company.id}/branch/${branch.id}/operational-status/stores`}
                        className="ml-[15px]"
                    >
                        <Circle />
                        Status Operacional
                    </ResponsiveNavLink>
                </>
            }
        </div>
    )
}

export default SideMenu