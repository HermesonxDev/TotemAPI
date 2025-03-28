function handleLocationType(status: number | undefined) {
    if (status === 1) return "Entrega"
    if (status === 2) return "Retirada"
    if (status === 4) return "Estabelecimento"
    if (status === 8) return "Totem"
}

export default handleLocationType
