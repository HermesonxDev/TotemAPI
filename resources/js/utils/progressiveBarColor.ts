function progressiveBarColor(value: number) {
    if (value >= 50) return "#4CAF50"
    if (value <= 40 && value > 20) return "#FB923C"
    if (value <= 20) return "#ee0808"
}

export default progressiveBarColor