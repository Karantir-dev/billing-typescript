export default function getInstanceMainInfo(item) {
  if (!item) return {}
  const fotboStatus = item.instance_status?.$.trim().toLowerCase()
  const billingStatus = item.item_status?.$.trim()

  const isStopped = fotboStatus === 'stopped'
  const isResized = fotboStatus === 'resized'
  const isRescued = fotboStatus === 'rescued'
  const isSuspended = fotboStatus === 'suspended'
  const isBootedFromISO = fotboStatus === 'booted_from_iso'
  const isImageUploading = fotboStatus === 'running_image_uploading'
  const isErrorStatus = fotboStatus === 'error'
  const isWindows = item.instances_os?.$.includes('Windows')

  const isNotActive =
    item?.status?.$ === '1' || item?.status?.$ === '4' || item?.status?.$ === '5'

  const isDeleting = billingStatus === 'Deletion in progress'

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
    fotboStatus === 'suspending' ||
    fotboStatus === 'booting_from_iso' ||
    billingStatus === 'Activation in progress' ||
    isImageUploading ||
    isDeleting

  const isDisabled =
    isProcessing ||
    isNotActive ||
    isSuspended ||
    isDeleting ||
    isImageUploading ||
    isErrorStatus

  const displayName = item?.servername?.$ || item?.name?.$
  const displayStatus = isDeleting
    ? billingStatus
    : fotboStatus?.replaceAll('_', ' ') || billingStatus

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
    isDeleting,
    isBootedFromISO,
    isImageUploading,
    isErrorStatus,
  }
}
