export default function formatCountryName(item) {
  let country = item
  if (typeof item === 'object' && item !== null) {
    country = item?.datacentername?.$
  }

  return country.replace('Fotbo ', '')
}
