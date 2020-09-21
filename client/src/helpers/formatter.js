const formatAmount = (currencyCode, amount, showSymbol) => {
  if (!amount && currencyCode) return undefined;

  const config = { 
    style: 'currency', 
    currency: currencyCode, 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }

  if (showSymbol) {
    return new Intl.NumberFormat('de-DE', config).format(amount)
  }

  return new Intl.NumberFormat(config).format(amount)
}

module.exports = {
  formatAmount
}