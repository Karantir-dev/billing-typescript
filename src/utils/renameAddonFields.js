/** This function mutates recieved data object */
/**
 * @param {Object} [options]
 * @param {boolean} [options.isNewFunc] - is flag for getting params from new api function.
 * @param {boolean} [options.isEditFunc] - is flag for getting params from edit order function.
 */
export default function renameAddonFields(data, options = {}) {
  const { isNewFunc, isEditFunc } = options
  for (const key in data?.messages?.msg) {
    if (key.match(/^(addon_\d+)$/g)) {
      if (!data.register) {
        data.register = {}
      }

      const newKey = data.messages.msg[key].replace(' ', '_').replace('-', '_')
      data.register[newKey] = key

      data[newKey] = data[key].$

      data.slist.find(el => {
        const desiredEl = el.$name === key
        if (desiredEl) {
          el.$name = newKey
        }

        return desiredEl
      })
    }
  }

  data.slist.find(el => {
    const desiredElIs = el.$name === 'Outgoing_traffic'
    if (desiredElIs) {
      el.$name = 'Port_speed'
    }

    return desiredElIs
  })

  let ipAddon = ''

  for (let key in data?.messages?.msg) {
    if (
      data?.messages?.msg[key]?.toLowerCase()?.includes('ip') &&
      data?.messages?.msg[key]?.toLowerCase()?.includes('count')
    ) {
      ipAddon = key
    }
  }

  /** New name for this param in updated billmgr version */
  const pageSettingsParamName = 'page_settings'

  /** Name for old billmgr version,
   * it should be deleted after we migrate to the new version  */
  const pageSettingsParamOldName = 'page_pricelist_settings'

  const ipSliderData = isNewFunc
    ? data.metadata?.form?.page
        .find(
          item =>
            item?.$name === pageSettingsParamOldName ||
            item?.$name === pageSettingsParamName,
        )
        .field?.find(item => item?.$name === ipAddon)?.slider[0]
    : isEditFunc
    ? data.metadata?.form?.page
        .find(item => item?.$name === 'addon')
        .field?.find(item => item?.$name === ipAddon)?.slider[0]
    : data?.metadata?.form?.field?.find(item => item?.$name === ipAddon)?.slider[0]

  const ipListData = []
  if (ipSliderData) {
    for (let i = 1; i <= ipSliderData.$max; i += Number(ipSliderData.$step)) {
      if (i === 1) {
        const item = { value: i, cost: '0.00' }
        ipListData.push(item)
      } else {
        const item = { value: i, cost: ipSliderData.$cost }
        ipListData.push(item)
      }
    }
    data.ipList = ipListData
  }

  const portSpeedList = data.slist.find(el => el.$name === 'Port_speed')?.val

  data.portSpeedList = portSpeedList

  if (isNewFunc) {
    const autoprolongVal = data.autoprolong.$

    data.autoprolong.$ =
      autoprolongVal === 'null' || autoprolongVal === 'off' ? 'off' : 'on'
  }

  return data
}
