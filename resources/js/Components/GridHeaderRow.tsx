interface IGridHeaderRowProps {
    children: React.ReactNode,
    gridCols: string,
    background: string
}

const GridHeaderRow: React.FC<IGridHeaderRowProps> = ({ children, gridCols, background }) => (
    <div className={`grid ${gridCols} bg-${background} text-white font-bold rounded-t-md`}>
        {children}
    </div>
)


export default GridHeaderRow
