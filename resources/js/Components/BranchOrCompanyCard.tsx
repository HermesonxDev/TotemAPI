interface IBranchOrCompanyCardProps {
    name: string,
    slug?: string,
    street?: string,
    number?: string,
    neighborhood?: string,
    state?: string
}

const BranchOrCompanyCard: React.FC<IBranchOrCompanyCardProps> = ({
    name,
    slug,
    street,
    number,
    neighborhood,
    state
}) => {
    return (
        <div className="text-gray-900">
            <strong>{name} {slug && `- ${slug}`}</strong>
            
            {street && number && neighborhood && state &&
                <p>{street}, {number}, {neighborhood}, {state}</p>
            }
        </div>
    )
}

export default BranchOrCompanyCard
