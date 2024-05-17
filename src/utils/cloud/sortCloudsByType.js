export default function sortCloudsByType(data) {
  const dcID = data.doc.datacenter.$

  const premiumTariffs = { [dcID]: [] }
  const basicTariffs = { [dcID]: [] }

  const tariffs = data.doc.list.find(el => el.$name === 'pricelist').elem
  const cloudBasicTag = data?.doc?.flist?.val.find(el =>
    el?.$.toLowerCase().includes('type:basic'),
  )?.$key

  const checkIsItBasicCloud = tags => tags?.some(tag => tag?.$.includes(cloudBasicTag))

  tariffs.forEach(el => {
    const isBasic = checkIsItBasicCloud(el?.flabel?.tag)

    isBasic ? basicTariffs[dcID].push(el) : premiumTariffs[dcID].push(el)
  })

  return { premiumTariffs, basicTariffs }
}
