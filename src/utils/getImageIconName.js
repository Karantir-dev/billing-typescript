export default function getImageIconName(distro, isDarkTheme) {
  const icon = distro?.match(/^(.+?)(?=-|\s|$)/g)?.[0]?.toLowerCase()
  return icon ? (isDarkTheme ? `${icon}_dt` : icon) : ''
}
