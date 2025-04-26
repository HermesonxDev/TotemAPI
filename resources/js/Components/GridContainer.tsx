interface IGridContainerProps {
    children: React.ReactNode,
    gap?: string,
    marginTop?: string
}

const GridContainer: React.FC<IGridContainerProps> = ({
    children,
    gap,
    marginTop
}) => (
    <div className={`w-[98%] flex flex-col gap-${gap} mx-auto mt-${marginTop}`}>
        {children}
    </div>
)

export default GridContainer