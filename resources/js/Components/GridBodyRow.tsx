interface IGridBodyProps {
    children: React.ReactNode,
    gridCols: string,
    background: string
}

const GridBodyRow: React.FC<IGridBodyProps> = ({ children, gridCols, background }) => (
    <div className={`grid ${gridCols} bg-${background} font-semibold text-sm border-t border-gray-300`}>
        {children}
    </div>
)

export default GridBodyRow
