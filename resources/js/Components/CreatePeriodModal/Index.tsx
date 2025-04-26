import { useState } from "react"
import Modal from "../Modal"
import ObjectId from 'bson-objectid';

import {
    Body,
    Container,
    Header,
    Menu,
    Button,
    Title,
    Period,
    PeriodRow,
    PeriodRow3,
} from "./styles"

import InputWithLabel from "../InputWithLabel"
import {
    Branch,
    Company,
    CreatePeriodForm,
    CreatePeriodFormOptions,
    PeriodTimeForm
} from "@/utils/interfaces"
import api from "@/Services/api";
import Loading from "../Loading";
import { usePage } from "@inertiajs/react";
import { WeekDay } from "@/utils/types";

interface ICreatePeriodModalProps {
    show: boolean,
    onClose(): void
}

const CreatePeriodModal: React.FC<ICreatePeriodModalProps> = ({ show, onClose }) => {

    const { props } = usePage()

    const MAX_TIMES = {
        monday: 2,
        tuesday: 2,
        wednesday: 2,
        thursday: 2,
        friday: 2,
        saturday: 2,
        sunday: 2
    }

    const branch = props.branch as Branch
    const company = props.company as Company

    const [loading, setLoading] = useState<boolean>(false)

    const [formState, setFormState] = useState<CreatePeriodForm>({
        branch: branch ? branch.id : "",
        company: company ? company.id : "",
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    })

    const [menuOptions, setMenuOptions] = useState<CreatePeriodFormOptions>({
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    })

    const handleMenuClick = (option: keyof CreatePeriodFormOptions) => {
        setMenuOptions({
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            [option]: true
        })
    }

    const handlePeriodInputChange = (
        day: WeekDay,
        index: number,
        field: keyof PeriodTimeForm,
        value: string
    ) => {
        setFormState((prev) => {
            const updatedDay = [...prev[day]];
            updatedDay[index] = { ...updatedDay[index], [field]: value };
            return { ...prev, [day]: updatedDay };
        });
    };      
      

    const handleAddPeriodSlot = (fieldName: keyof typeof MAX_TIMES) => {
        setFormState((prev) => {
            if (prev[fieldName].length < MAX_TIMES[fieldName]) {
                return {
                    ...prev,
                    [fieldName]: [
                        ...prev[fieldName],
                        {   
                            _id: new ObjectId().toString(),
                            disabled: false,
                            to: "",
                            from: ""
                        }
                    ]
                };
            }
            return prev;
        });
    };

    const handleRemovePeriodSlot = (fieldName: keyof typeof MAX_TIMES, index: number) => {
        setFormState((prev) => {
            const updatedPeriods = prev[fieldName].filter((_, i) => i !== index);
            return { ...prev, [fieldName]: updatedPeriods };
        });
    };

    const handleFormState = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading(true);

            await api.post('/create/period', formState);

            window.location.reload();
        } catch (err: unknown) {
            setLoading(false);
            console.error("Erro no handleFormState: ", err);
        }
    };

    const DayPeriodEditor = ({ day }: { day: WeekDay }) => (
        <Period>
            {formState[day].map((slots, index) => (
                <PeriodRow gridArea={`row${index + 1}`} key={index}>
                <InputWithLabel
                    label="Inicio"
                    value={slots.from}
                    height="70%"
                    onChange={(e) => handlePeriodInputChange(day, index, "from", e.target.value)}
                    type="time"
                />
        
                <InputWithLabel
                    label="Fim"
                    value={slots.to}
                    height="70%"
                    onChange={(e) => handlePeriodInputChange(day, index, "to", e.target.value)}
                    type="time"
                />
        
                <button
                    type="button"
                    className="text-xs hover:bg-black hover:text-white h-[50%] px-1 rounded my-auto"
                    onClick={() => handleRemovePeriodSlot(day, index)}
                >
                    Remover
                </button>
                </PeriodRow>
            ))}
      
            <PeriodRow3>
                <div className="absolute bottom-0 right-0">
                {!loading ? (
                    <>
                    {formState[day].length < MAX_TIMES[day] && (
                        <Button type="button" margin="0 5px 0 0" onClick={() => handleAddPeriodSlot(day)}>
                        Adicionar Horário
                        </Button>
                    )}
                    <Button type="submit">Salvar</Button>
                    </>
                ) : (
                    <Loading width="50px" />
                )}
                </div>
            </PeriodRow3>
        </Period>
    );

    return (
        <Modal show={show} onClose={onClose}>
            <Container>
                <Header>
                    <Title margin="1rem 0 0 0.75rem">Criar Período</Title>
                    <Button
                        type="button"
                        margin="0.75rem"
                        onClick={onClose}
                    >Sair</Button>
                </Header>

                <Body className="bg-gray-100" onSubmit={handleFormState}>
                    <Menu>
                        <Button
                            type="button"
                            onClick={() => handleMenuClick('monday')}
                            backgroundColor={menuOptions.monday ? "black" : "unset"}
                            color={menuOptions.monday ? "white" : "black"}
                        >Segunda</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('tuesday')}
                            backgroundColor={menuOptions.tuesday ? "black" : "unset"}
                            color={menuOptions.tuesday ? "white" : "black"}
                        >Terça</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('wednesday')}
                            backgroundColor={menuOptions.wednesday ? "black" : "unset"}
                            color={menuOptions.wednesday ? "white" : "black"}
                        >Quarta</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('thursday')}
                            backgroundColor={menuOptions.thursday ? "black" : "unset"}
                            color={menuOptions.thursday ? "white" : "black"}
                        >Quinta</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('friday')}
                            backgroundColor={menuOptions.friday ? "black" : "unset"}
                            color={menuOptions.friday ? "white" : "black"}
                        >Sexta</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('saturday')}
                            backgroundColor={menuOptions.saturday ? "black" : "unset"}
                            color={menuOptions.saturday ? "white" : "black"}
                        >Sábado</Button>

                        <Button
                            type="button"
                            onClick={() => handleMenuClick('sunday')}
                            backgroundColor={menuOptions.sunday ? "black" : "unset"}
                            color={menuOptions.sunday ? "white" : "black"}
                        >Domingo</Button>
                    </Menu>

                    {menuOptions.monday && <DayPeriodEditor day="monday" />}
                    {menuOptions.tuesday && <DayPeriodEditor day="tuesday" />}
                    {menuOptions.wednesday && <DayPeriodEditor day="wednesday" />}
                    {menuOptions.thursday && <DayPeriodEditor day="thursday" />}
                    {menuOptions.friday && <DayPeriodEditor day="friday" />}
                    {menuOptions.saturday && <DayPeriodEditor day="saturday" />}
                    {menuOptions.sunday && <DayPeriodEditor day="sunday" />}
                </Body>
            </Container>
        </Modal>
    )
}

export default CreatePeriodModal