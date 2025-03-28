import { Container, LoadingIcon } from "./styles"

interface IContainerProps {
    marginTop?: string,
    width?: string,
    height?: string
}

const Loading: React.FC<IContainerProps> = ({ marginTop, width, height }) => (
    <Container marginTop={marginTop}>
        <LoadingIcon width={width} height={height}/>
    </Container>
)

export default Loading
