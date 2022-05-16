export default function checkIfComponentShouldRender(rightsList, sectionName, funcName) {
  // componentName => name of function from BACK

  const isCurrentSectionAllowed = rightsList.some(obj => {
    return obj.$name === sectionName
  }) // if includes the name of func, this right is allowed

  const isCurrentPageAllowed = rightsList.some(obj => {
    const res = obj.node.some(el => {
      return funcName ? el.$name === funcName : true
    })

    return res
  })

  return isCurrentSectionAllowed && isCurrentPageAllowed
}
