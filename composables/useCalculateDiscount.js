export const useCalculateDiscount = (discount,quantity, total, unitPrice) => {
    let result = (discount / total) * unitPrice;
    return result * quantity;
}