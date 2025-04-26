import { createContext, useContext, useState } from "react";
import api from "@/Services/api";
import { CategoryAndComplementCardLoadings, Loadings } from "@/utils/interfaces";
import { useLog } from "./log";

interface IProductContext {
    loadings: Loadings,
    loading: CategoryAndComplementCardLoadings,
    handleLoadingsClick(option: keyof CategoryAndComplementCardLoadings, value: boolean): void
    handleToggle(id: string, status: boolean, type: string): void
}

const ProductConext = createContext<IProductContext>({} as IProductContext)

const ProductProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    const { activeNotification, setNotificationContent } = useLog()

    const [loadings, setLoadings] = useState<Loadings>({})

    const [loading, setLoading] = useState<CategoryAndComplementCardLoadings>({
        page: true,
        category: false,
        complementGroup: false,
        product: false
    })

    const handleToggle = async (id: string, status: boolean, type: string) => {
        try {
            setLoadings(prev => {
                if (type === 'soldOut') {
                    return {
                        ...prev,
                        [id]: {
                            ...prev[id],
                            [type]: toggleMessageValidate(status, 'sold-out')
                        }
                    }
                } else {
                    return {
                        ...prev,
                        [id]: {
                            ...prev[id],
                            [type]: toggleMessageValidate(status, 'status')
                        }
                    }
                }
            })

            const data = { id: id, status: status }

            if (type === "status") {
                await api.post('/status/product', data)

            } else if (type === "complementGroup") {
                await api.post('/status/complement-group', data)
                
            } else if (type === "category") {
                await api.post('/status/category', data)

            } else if (type === "soldOut") {
                await api.post('/sold-out/product', data)
            }

            window.location.reload()
        } catch (error) {
            activeNotification("error")
            setNotificationContent({
                title: "Erro ao tentar atualizar status",
                message: `handleToggle() ${String(error)}`,
            })
        }
    }

    const handleLoadingsClick = (option: keyof CategoryAndComplementCardLoadings, value: boolean) => {
        setLoading({
            page: false,
            category: false,
            complementGroup: false,
            product: false,
            [option]: value
        })
    }

    const toggleMessageValidate = (value: boolean, type: string) => {
        if (type === 'status') {
            if (value === true) {
                return "(Ativando...)"
            } else {
                return "(Inativando...)"
            }
        } else {
            if (value === true) {
                return "(Disponibilizando...)"
            } else {
                return "(Esgotando...)"
            }
        }
    }

    return (
        <ProductConext.Provider value={{
            loadings,
            loading,
            handleLoadingsClick,
            handleToggle
        }}>
            {children}
        </ProductConext.Provider>
    )
}

function useProduct(): IProductContext {
    const context = useContext(ProductConext)

    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider")
    }

    return context
}

export { ProductProvider, useProduct }