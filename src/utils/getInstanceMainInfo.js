export default function getInstanceMainInfo(item) {
  const isStopped = item.fotbo_status?.$ === 'stopped'
  const isResized = item.fotbo_status?.$ === 'resized'
  const isRescued = item.fotbo_status?.$ === 'rescued'
  const isWindows = item.instances_os?.$.includes('Windows')

  const isNotActive =
    item.status.$ === '1' || item.status.$ === '4' || item.status.$ === '5'

  const isProcessing =
    item.fotbo_status?.$ === 'stoping' ||
    item.fotbo_status?.$ === 'starting' ||
    item.fotbo_status?.$ === 'creating' ||
    item.fotbo_status?.$ === 'building' ||
    item.fotbo_status?.$ === 'resizing' ||
    item.fotbo_status?.$ === 'processing' ||
    item.fotbo_status?.$ === 'rebooting' ||
    item.fotbo_status?.$ === 'rescuing' ||
    item.fotbo_status?.$ === 'unrescuing' ||
    item.fotbo_status?.$ === 'rebuilding'

  const isDisabled = isProcessing || isNotActive

  const displayName = item.servername?.$ || item.name.$
  const displayStatus = item.fotbo_status?.$?.replaceAll('_', ' ') || item.item_status?.$
  return {
    isNotActive,
    isDisabled,
    isProcessing,
    isStopped,
    isResized,
    isRescued,
    isWindows,
    displayName,
    displayStatus,
  }
}
