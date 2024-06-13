const { SoftwareOSBtn, SoftwareOSSelect } = require('@src/Components')

export default function OsList({ value, list, onOSchange }) {
  const elemsData = {}

  list?.forEach(element => {
    const itemName = element.$.match(/^(.+?)(?=-|\s|$)/g)

    if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
      elemsData[itemName] = [{ ...element }]
    } else {
      elemsData[itemName].push({ ...element })
    }
  })

  return Object.entries(elemsData).map(([name, el]) => {
    if (el.length > 1) {
      const optionsList = el.map(item => {
        item.value = item.$key
        item.label = item.$
        return item
      })

      return (
        <SoftwareOSSelect
          key={el[0].$key}
          iconName={name.toLowerCase()}
          itemsList={optionsList}
          state={value}
          getElement={onOSchange}
        />
      )
    } else {
      return (
        <SoftwareOSBtn
          key={el[0].$key}
          value={el[0].$key}
          state={value}
          iconName={name.toLowerCase()}
          label={el[0].$}
          imageData={el[0]}
          onClick={onOSchange}
        />
      )
    }
  })
}
