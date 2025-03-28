interface IGridContainerProps {
    children: React.ReactNode
}

const GridContainer: React.FC<IGridContainerProps> = ({ children }) => (
    <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] w-[99%] bg-gray-200 mx-auto rounded">
        {children}
    </div>
)

export default GridContainer
