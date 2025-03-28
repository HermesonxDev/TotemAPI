interface IGridHeaderItemProps {
    children: React.ReactNode
}

const GridHeaderItem: React.FC<IGridHeaderItemProps> = ({ children }) => (
    <div className="p-[10px] flex justify-center">
        {children}
    </div>
)

export default GridHeaderItem
