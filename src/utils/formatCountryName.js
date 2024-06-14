const DC_COUNTRIES = ['Netherlands', 'Poland']

/**
 *
 * @param {Object | String} item
 * @returns {String}
 */
export default function formatCountryName(data, key = 'datacentername') {
  let inputString
  if (typeof data === 'object' && data !== null) {
    inputString = data?.[key]?.$
  } else {
    inputString = data
  }

  const countryName = DC_COUNTRIES.find(country =>
    inputString?.toLowerCase().includes(country.toLowerCase()),
  )

  if (!countryName) {
    console.error('country name parse failed')
    return undefined
  }

  return countryName
}
