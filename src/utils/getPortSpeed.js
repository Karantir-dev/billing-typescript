export default function getPortSpeed(parameters) {
  const temp = parameters?.slist?.find(el => el.$name === 'Port_speed')?.val
  const value = Array.isArray(temp) ? temp?.[0].$ : temp?.$
  return value ? value : ''
}
