export default function checkServicesRights(toolgrp) {
  const rights = {}

  toolgrp?.forEach(section => {
    section?.toolbtn?.forEach(rightName => {
      rights[rightName.$name] = true
    })
  })

  return rights
}
