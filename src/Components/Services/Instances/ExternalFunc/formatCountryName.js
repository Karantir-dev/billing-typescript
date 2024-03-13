export default function formatCountryName(item) {
  const country = item.datacentername.$
  return country.replace('Fotbo ', '')
}
