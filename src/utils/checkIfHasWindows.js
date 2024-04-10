export default function checkIfHasWindows(tariffData, windowsTag) {
  let tariffHasWindows
  if (Array.isArray(tariffData?.flabel.tag)) {
    tariffHasWindows = tariffData.flabel.tag.some(el => el.$ === windowsTag)
  } else {
    tariffHasWindows = tariffData?.flabel.tag.$ === windowsTag
  }
  return tariffHasWindows
}
