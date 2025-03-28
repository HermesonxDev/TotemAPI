interface IGridHeaderRowProps {
    children: React.ReactNode
}

const GridHeaderRow: React.FC<IGridHeaderRowProps> = ({ children }) => (
    <div className="contents font-bold border-b-2 border-b-gray-400">
        {children}
    </div>
)

export default GridHeaderRow
