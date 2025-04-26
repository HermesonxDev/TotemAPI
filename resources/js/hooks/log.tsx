import { INotificationContent } from "@/utils/interfaces";
import { createContext, useContext, useState } from "react";

interface ILogContext {
    showErrorNotification: boolean,
    showEmailNotification: boolean,
    showUpdateNotification: boolean,
    showSuccessNotification: boolean,
    notificationContent: INotificationContent,
    setNotificationContent: React.Dispatch<React.SetStateAction<INotificationContent>>,
    activeNotification(notification: string): void,
    removeNotification(): void
}


/* CRIA O CONTEXTO PARA SER USADO NA APLICAÇÃO */
const LogContext = createContext<ILogContext>({} as ILogContext)


/*
* --> PROVÊ O CONTEXTO PARA A APLICAÇÃO
*      Guarda as funções e variáveis que podem ser chamadas e utilizadas em qualquer
*      canto da aplicação.
*/
const LogProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {

    const [showErrorNotification, setShowErrorNotification] = useState<boolean>(false)
    const [showEmailNotification, setShowEmailNotification] = useState<boolean>(false)
    const [showUpdateNotification, setShowUpdateNotification] = useState<boolean>(false)
    const [showSuccessNotification, setShowSuccessNotification] = useState<boolean>(false)

    const [notificationContent, setNotificationContentState] = useState<INotificationContent>({title: '', message: '' })


    /*
    * --> GUARDA A MENSAGEM DE ERRO
    *      Recebe um array contendo title e message, e atribui a variavel notificationContent.
    */
    const setNotificationContent: React.Dispatch<React.SetStateAction<INotificationContent>> = (value) => {
        setNotificationContentState((prevState: INotificationContent) => {
            const newValue = typeof value === 'function' ? value(prevState) : value
            return newValue
        });
    };


    /*
    * --> ATIVA A NOTIFICAÇÃO DE ERRO
    *      Atribui o valor true a variavel setShowErrorNotification que decide
    *      se a notificação vai ser exibida.
    */
    const activeNotification = (notification: string) => {
        if (notification === "error") {
            setShowErrorNotification(true)
        }
        if (notification === "email") {
            setShowEmailNotification(true)
        }
        if (notification === "update") {
            setShowUpdateNotification(true)
        }
        if (notification === "success") {
            setShowSuccessNotification(true)
        }
    }


    /*
    * --> DESATIVA A NOTIFICAÇÃO DE ERRO
    *      Atribui o valor false a variavel setShowErrorNotification que decide
    *      se a notificação vai ser exibida.
    */
    const removeNotification = () => {
        setShowErrorNotification(false)
        setShowEmailNotification(false)
        setShowUpdateNotification(false)
        setShowSuccessNotification(false)
    }

    return (
        <LogContext.Provider value={{
            showErrorNotification,
            showEmailNotification,
            showUpdateNotification,
            showSuccessNotification,
            notificationContent,
            setNotificationContent,
            activeNotification,
            removeNotification
        }}>
            { children }
        </LogContext.Provider>
    )
}


/*
* --> DA ACESSO AS FUNÇÕES E VARIÁVEIS DO CONTEXTO
*      Por meio de desestruturação é possivel acessar qualquer dado do contexto
*      ao instanciar a função abaixo.
*/
function useLog(): ILogContext {
    const context = useContext(LogContext)
    if (!context) {
        throw new Error("useLog must be used within a LogProvider");
    }
    return context
}

export { LogProvider, useLog }