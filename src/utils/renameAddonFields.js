export default function renameAddonFields(data) {
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

  return data
}
