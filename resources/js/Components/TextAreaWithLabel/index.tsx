import { useState } from "react";
import { Container, TextArea, Label } from "./styles";

interface ITextAreaWithLabelProps {
    label: string;
    value?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    width?: string;
    height?: string;
    padding?: string;
    maxLength?: number;
}

const TextAreaWithLabel: React.FC<ITextAreaWithLabelProps> = ({
    label,
    value = "",
    required,
    onChange,
    width,
    height,
    padding,
    maxLength
}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <Container width={width} height={height}>
            <Label isFocused={isFocused || value !== ""}>{label}</Label>
            <TextArea
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                maxLength={maxLength}
                padding={padding}
            />
        </Container>
    );
};

export default TextAreaWithLabel;
