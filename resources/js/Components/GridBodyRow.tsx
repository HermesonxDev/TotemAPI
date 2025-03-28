interface IGridBodyProps {
    children: React.ReactNode
}

const GridBodyRow: React.FC<IGridBodyProps> = ({ children }) => (
    <div className="contents">
        {children}
    </div>
)

export default GridBodyRow
