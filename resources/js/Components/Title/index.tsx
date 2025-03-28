import { ReactNode } from 'react';
import { Container } from "./styles";

interface ITitleProps {
    color?: string,
    bottomColor?: string,
    margin?: string,
    padding?: string,
    fontSize?: string,
    quantity?: string,
    backgroundColor?: string,
    borderRadius?: string,
    children: ReactNode,
    onClick?: () => void
}

const Title: React.FC<ITitleProps> = ({
    children,
    color,
    bottomColor,
    backgroundColor,
    borderRadius,
    margin,
    padding,
    fontSize,
    quantity,
    onClick
}) => (
    <Container
        color={color}
        bottomColor={bottomColor}
        margin={margin}
        padding={padding}
        fontSize={fontSize}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        onClick={onClick}
    >
        {children} {quantity && <>({quantity})</>}
    </Container>
);

export default Title;
