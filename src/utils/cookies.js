const hostNameArr = window?.location?.hostname?.split('.')?.slice(1)
const hostName =
  hostNameArr?.length > 2 ? hostNameArr?.slice(1)?.join('.') : hostNameArr?.join('.')

const domain = `domain=.${hostName}`

function setCookie(name, value, days) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }

  document.cookie = name + '=' + (value || '') + expires + `; path=/; ${domain}`
}

function getCookie(name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function eraseCookie(name) {
  document.cookie = name + `=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; ${domain}`
}

export default {
  setCookie,
  getCookie,
  eraseCookie,
}