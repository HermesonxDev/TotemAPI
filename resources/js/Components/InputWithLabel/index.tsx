import { useState } from "react";
import { Container, Input, Label, FileButtonWrapper, HiddenFileInput, StyledButton } from "./styles";

interface IInputWithLabelProps {
    label?: string,
    value?: string | number,
    required?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    width?: string,
    margin?: string,
    height?: string,
    padding?: string,
    type?: string,
    accept?: string,
    maxLength?: number,
    imageDisplay?: string,
    readOnly?: boolean
}

const InputWithLabel: React.FC<IInputWithLabelProps> = ({
    label,
    value = '',
    required,
    onChange,
    width,
    margin,
    height,
    padding,
    type = 'text',
    accept,
    maxLength,
    imageDisplay,
    readOnly
}) => {

    const [isFocused, setIsFocused] = useState<boolean>(false)

    const handleButtonClick = (inputRef: HTMLInputElement | null) => {
        if (inputRef) {
            inputRef.click();
        }
    };

    return (
        <Container width={width} height={height} margin={margin}>
            <Label isFocused={type === 'color' ? true : isFocused || value !== ''}>
                {label}
            </Label>

            {type === 'file'
                ?
                <FileButtonWrapper>
                    <HiddenFileInput
                        type={type}
                        onChange={onChange}
                        required={required}
                        accept={accept}
                        ref={(ref) => ref && (ref.required = required || false)}
                        imageDisplay={imageDisplay}
                    />
                    <StyledButton
                        onClick={() => handleButtonClick(document.querySelector(`input[type="file"]`))}
                        type="button"
                    >
                        Escolher Arquivo
                    </StyledButton>
                </FileButtonWrapper>

                :
                <Input
                    type={type}
                    padding={padding}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    accept={accept}
                    maxLength={maxLength}
                    readOnly={readOnly}
                />
            }
        </Container>
    );
};

export default InputWithLabel;
