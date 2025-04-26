function contains(array: string[], ...values: string[]) {
    return values.some(value => array.includes(value))
}

export default contains