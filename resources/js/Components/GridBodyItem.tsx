interface IGridBodyItemProps {
    children?: React.ReactNode,
    className?: string,
    border?: boolean
}

const GridBodyItem: React.FC<IGridBodyItemProps> = ({ children, className, border }) => (
    <div className={`py-[15px] flex justify-center bg-gray-200 ${border && "border-b-2 border-b-gray-400"} items-center + ${className}`}>
        {children}
    </div>
)

export default GridBodyItem
