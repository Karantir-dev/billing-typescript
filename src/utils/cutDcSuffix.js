/** Function to cut the DC suffix in the cloud tariff name */
export default function cutDcSuffix(tariffName) {
  return tariffName?.split('|')[0].trim()
}
