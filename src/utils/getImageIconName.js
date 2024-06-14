export default function getImageIconName(distro) {
  return distro?.match(/^(.+?)(?=-|\s|$)/g)?.[0]?.toLowerCase() || ''
}
