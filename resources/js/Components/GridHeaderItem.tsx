interface IGridHeaderItemProps {
    children?: React.ReactNode,
    padding?: string,
    className?: string
}

const GridHeaderItem: React.FC<IGridHeaderItemProps> = ({ children, padding, className }) => (
    <div className={`${padding} text-center ${className}`}>
        {children}
    </div>
)

export default GridHeaderItem
