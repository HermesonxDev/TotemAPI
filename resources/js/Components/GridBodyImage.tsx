import noPhoto from "../../img/noPhoto.png"

interface IGridBodyImageProps {
    src?: string,
    width?: string
}

const GridBodyImage: React.FC<IGridBodyImageProps> = ({ src, width }) => (
    <img
        src={src ? src : noPhoto}
        className={`${width ? width : 'w-[35%]'} m-auto`}
    />
)

export default GridBodyImage
