// type: ceil round to increase, floor to decrease

export default function roundToDecimal(number, type = 'ceil', decimalPlaces = 2) {
  const multiplier = 10 ** decimalPlaces
  return (Math[type](number * multiplier) / multiplier).toFixed(decimalPlaces)
}
