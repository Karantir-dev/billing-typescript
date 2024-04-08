const DC_COUNTRIES = ['Netherlands', 'Poland']

export default function formatCountryName(item) {
  let countryName = item
  if (typeof item === 'object' && item !== null) {
    countryName = item?.datacentername?.$
  }

  countryName = DC_COUNTRIES.find(country =>
    countryName.toLowerCase().includes(country.toLowerCase()),
  )
  if (!countryName) {
    console.error('country name parse failed')
  }

  return countryName
}
