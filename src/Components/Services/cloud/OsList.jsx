import { getImageIconName } from '@src/utils'

const { SoftwareOSBtn, SoftwareOSSelect } = require('@src/Components')

export default function OsList({ value, list, onOSchange }) {
  const elemsData = {}

  list?.forEach(element => {
    const itemName = getImageIconName(element.$)

    if (!Object.prototype.hasOwnProperty.call(elemsData, itemName)) {
      elemsData[itemName] = [{ ...element }]
    } else {
      elemsData[itemName].push({ ...element })
    }
  })

  return Object.entries(elemsData).map(([name, osArr]) => {
    if (osArr.length > 1) {
      const optionsList = osArr.map(item => {
        item.value = item.$key
        item.label = item.$
        return item
      })

      return (
        <SoftwareOSSelect
          key={osArr[0].$key}
          iconName={name.toLowerCase()}
          itemsList={optionsList}
          state={value}
          getElement={onOSchange}
        />
      )
    } else {
      return (
        <SoftwareOSBtn
          key={osArr[0].$key}
          value={osArr[0].$key}
          state={value}
          iconName={name.toLowerCase()}
          label={osArr[0].$}
          imageData={osArr[0]}
          onClick={onOSchange}
        />
      )
    }
  })
}
