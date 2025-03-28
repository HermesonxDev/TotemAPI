function formatMoney(value: number | undefined): string {
    return `R$ ${value?.toFixed(2).replace(".", ",")}`;
}

export default formatMoney;
