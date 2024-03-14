export default function getInstanceMainInfo(item) {
  const isNotActive =
    item.status.$ === '1' || item.status.$ === '4' || item.status.$ === '5'

  const isStopped = item.fotbo_status?.$ === 'stopped'
  const isResized = item.fotbo_status?.$ === 'resized'
  const isRescued = item.fotbo_status?.$ === 'booted_from_iso'
  const isWindows = item.instances_os?.$.includes('Windows')

  const displayName = item.servername?.$ || item.name.$
  const displayStatus = item.fotbo_status?.$?.replaceAll('_', ' ') || item.item_status?.$

  return {
    isNotActive,
    isStopped,
    isResized,
    isRescued,
    isWindows,
    displayName,
    displayStatus,
  }
}
