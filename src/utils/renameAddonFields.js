export default function renameAddonFields(data, isNewFunc) {
  // isNewFunc is flag for getting params from new api function
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

  const ipSliderData = isNewFunc
    ? data.metadata?.form?.page
        .find(item => item?.$name === 'page_pricelist_settings')
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

  return data
}
