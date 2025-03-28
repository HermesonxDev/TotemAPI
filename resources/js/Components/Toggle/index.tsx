import { Container, ToggleLabel, ToggleSelector } from "./styles";

interface IToggleProps {
    labelLeft?: string,
    labelRight?: string,
    checked: boolean,
    margin?: string,
    onChange(): void
}

const Toggle: React.FC<IToggleProps> = ({
    labelLeft,
    labelRight,
    checked,
    margin,
    onChange
}) => (
    <Container>
        <ToggleLabel>{ labelLeft }</ToggleLabel>
        <ToggleSelector
            checked={checked}
            uncheckedIcon={false}
            checkedIcon={false}
            margin={margin}
            onChange={onChange}
        />
        <ToggleLabel>{ labelRight }</ToggleLabel>
    </Container>
)

export default Toggle;
