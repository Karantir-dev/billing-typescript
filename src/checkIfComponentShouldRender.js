export default function checkIfComponentShouldRender(rightsList, componentName) {
  // componentName => name of function from BACK

  const isCurrentPageAllowed = rightsList.some(obj => {
    return obj.node.some(el => el.$name === componentName)
  }) // if includes the name of func, this right is allowed

  return isCurrentPageAllowed
}
