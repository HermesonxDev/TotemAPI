function handleStatusColor(status: number) {
    if (status === 1) return "#f7931b"
    if (status === 2) return "#1A73E8"
    if (status === 512) return "#00bb00"
}

export default handleStatusColor
