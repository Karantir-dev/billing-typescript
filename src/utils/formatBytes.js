export default function formatBytes(bytes, unit) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  if (!unit) {
    if (bytes < 1) return `${bytes} Bytes`

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  } else {
    let convertedValue

    switch (unit) {
      case 'KB':
        convertedValue = bytes / k
        break
      case 'MB':
        convertedValue = bytes / (k * k)
        break
      case 'GB':
        convertedValue = bytes / (k * k * k)
        break
      case 'TB':
        convertedValue = bytes / (k * k * k * k)
        break
    }

    // Округлення до більшого цілого
    convertedValue = Math.ceil(convertedValue)

    return `${convertedValue} ${unit}`
  }
}
