import noPhoto from "../../img/noPhoto.png"

interface IGridBodyImageProps {
    src?: string,
    className?: string
}

const GridBodyImage: React.FC<IGridBodyImageProps> = ({ src, className }) => (
    <img
        src={src ? src : noPhoto}
        className={`w-[60%] py-[15px] mx-auto flex justify-center bg-gray-200 items-center + ${className}`}
    />
)

export default GridBodyImage
