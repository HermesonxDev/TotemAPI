import { Branch, Company } from "@/utils/interfaces"
import NavLink from "./NavLink"

interface IStatusOperationalMenuProps {
    company: Company,
    branch: Branch,
    activatedLink: string
}

const StatusOperationalMenu: React.FC<IStatusOperationalMenuProps> = ({ branch, company, activatedLink }) => {
    return (
        <div className="flex flex-row gap-2">
            <NavLink href="#" active={activatedLink === 'orders'}>
                Pedidos
            </NavLink>

            <NavLink
                active={activatedLink === 'stores'}
                href={`/company/${company.id}/branch/${branch.id}/operational-status/stores`}
            >
                Lojas
            </NavLink>

            <NavLink
                active={activatedLink === 'menu'}
                href={`/company/${company.id}/branch/${branch.id}/operational-status/menu`}
            >
                Cardápio
            </NavLink>

            <NavLink
                active={activatedLink === 'totem'}
                href={`/company/${company.id}/branch/${branch.id}/operational-status/totem`}
            >
                Totem
            </NavLink>
        </div>
    )
}

export default StatusOperationalMenu