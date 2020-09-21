const formatAmount = (currencyCode, amount, showSymbol) => {
  if (!amount && currencyCode) return undefined;

  if (showSymbol) {
    return new Intl.NumberFormat('da-DK', { style: 'currency', currency: currencyCode }).format(amount)
  }

  return new Intl.NumberFormat({ style: 'currency', currency: currencyCode }).format(amount)
}

module.exports = {
  formatAmount
}