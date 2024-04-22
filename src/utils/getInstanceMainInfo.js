export default function getInstanceMainInfo(item) {
  const fotboStatus = item.fotbo_status?.$.trim()
  const billingStatus = item.item_status?.$.trim()

  const isStopped = fotboStatus === 'stopped'
  const isResized = fotboStatus === 'resized'
  const isRescued = fotboStatus === 'rescued'
  const isSuspended = fotboStatus === 'suspend'
  const isWindows = item.instances_os?.$.includes('Windows')

  const isNotActive =
    item.status.$ === '1' || item.status.$ === '4' || item.status.$ === '5'

  const isProcessing =
    fotboStatus === 'stopping' ||
    fotboStatus === 'starting' ||
    fotboStatus === 'creating' ||
    fotboStatus === 'building' ||
    fotboStatus === 'resizing' ||
    fotboStatus === 'processing' ||
    fotboStatus === 'rebooting' ||
    fotboStatus === 'rescuing' ||
    fotboStatus === 'unrescuing' ||
    fotboStatus === 'rebuilding' ||
    billingStatus === 'Activation in progress'

  const isDisabled = isProcessing || isNotActive || isSuspended

  const displayName = item.servername?.$ || item.name.$
  const displayStatus = fotboStatus?.replaceAll('_', ' ') || billingStatus
  return {
    isNotActive,
    isDisabled,
    isProcessing,
    isStopped,
    isResized,
    isRescued,
    isSuspended,
    isWindows,
    displayName,
    displayStatus,
  }
}
