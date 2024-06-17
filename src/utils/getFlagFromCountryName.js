export default function getFlagFromCountryName(country) {
  switch (country?.toLowerCase()) {
    case 'netherlands':
      return 'nl'
    case 'poland':
      return 'pl'
  }
}
