export default function isBase64(v, opts) {
  if (v instanceof Boolean || typeof v === 'boolean') {
    return false
  }

  if (!(opts instanceof Object)) {
    opts = {}
  }

  if (opts.allowEmpty === false && v === '') {
    return false
  }

  var regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+/]{3}=)?'
  var mimeRegex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)'

  if (opts.mimeRequired === true) {
    regex = mimeRegex + regex
  } else if (opts.allowMime === true) {
    regex = mimeRegex + '?' + regex
  }

  if (opts.paddingRequired === false) {
    regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?'
  }

  return new RegExp('^' + regex + '$', 'gi').test(v)
}
