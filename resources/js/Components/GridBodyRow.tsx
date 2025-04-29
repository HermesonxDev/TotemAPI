interface IGridBodyProps {
    children: React.ReactNode,
    gridCols: string,
    background: string,
    className?:string
}

const GridBodyRow: React.FC<IGridBodyProps> = ({ children, gridCols, background, className }) => (
    <div className={`grid ${gridCols} bg-${background} font-semibold text-sm border-t border-gray-300 ${className} rounded`}>
        {children}
    </div>
)

export default GridBodyRow
