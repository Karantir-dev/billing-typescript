export default function renameAddonFields(data) {
  for (const key in data.messages.msg) {
    if (key.match(/^(addon_\d+)$/g)) {
      if (!data.register) {
        data.register = {}
      }

      const newKey = data.messages.msg[key].replace(' ', '_').replace('-', '_')
      data.register[key] = newKey

      data[newKey] = data[key].$
      if (data.Outgoing_traffic) {
        const value = data.Outgoing_traffic
        data.Port_speed = value
        delete data.Outgoing_traffic
      }

      data.slist.find(el => {
        const desiredEl = el.$name === key
        if (desiredEl) {
          el.$name = newKey
        }

        return desiredEl
      })
    }
  }

  return data
}
