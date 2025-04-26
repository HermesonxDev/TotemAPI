import noPhoto from "../../img/noPhoto.png"

interface IGridBodyImageProps {
    src?: string,
    className?: string
}

const GridBodyImage: React.FC<IGridBodyImageProps> = ({ src, className }) => (
    <img
        src={src ? src : noPhoto}
        className={`w-[35%] m-auto`}
    />
)

export default GridBodyImage
