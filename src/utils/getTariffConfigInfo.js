export default function (parameters, field, keyName = field) {
  return parameters.slist
    .find(el => el.$name === field)
    ?.val.find(el => el.$key === parameters[keyName])
    .$.replace(/\(.*?\)/g, '')
}
