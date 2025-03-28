function handleTitleCard(text: number) {
    if (text === 1) return "Pendente"
    if (text === 2) return "Aprovado"
    if (text === 512) return "Finalizado"
}

export default handleTitleCard
