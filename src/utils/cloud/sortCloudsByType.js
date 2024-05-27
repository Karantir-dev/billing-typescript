export default function sortCloudsByType(data, cloudBasicTag) {
  const dcID = data.doc.datacenter.$

  /**
   * let premiumTariffs = { [dcID]: [] }
   * let basicTariffs = { [dcID]: [] }
   */
  let premiumTariffs = null
  let basicTariffs = null

  const tariffs = data.doc.list.find(el => el.$name === 'pricelist').elem

  const checkIsItBasicCloud = tags => tags?.some(tag => tag?.$.includes(cloudBasicTag))

  tariffs.forEach(el => {
    const isBasic = checkIsItBasicCloud(el?.flabel?.tag)

    if (isBasic) {
      if (basicTariffs?.[dcID]) {
        basicTariffs[dcID].push(el)
      } else {
        basicTariffs = { [dcID]: [] }
        basicTariffs[dcID].push(el)
      }
    } else {
      if (premiumTariffs?.[dcID]) {
        premiumTariffs[dcID].push(el)
      } else {
        premiumTariffs = { [dcID]: [] }
        premiumTariffs[dcID].push(el)
      }
    }
  })

  return { premiumTariffs, basicTariffs }
}
