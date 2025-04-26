interface IGridBodyItemProps {
    children?: React.ReactNode,
    padding?: string,
    className?: string,
}

const GridBodyItem: React.FC<IGridBodyItemProps> = ({ children, padding, className }) => (
    <div className={`${padding} text-center ${className}`}>
        {children}
    </div>
)

export default GridBodyItem
