export const DOMAIN_REGEX =
  /^(?!-)(?:[a-zA-Z\d-]{0,62}[a-zA-Z\d]\.){1,126}(?!\d+)[a-zA-Z\d]{1,63}$/g

export const SPECIAL_CHARACTERS_REGEX = /^[^!#$%^&*()\]~/}[{=?|"<>',+:;]+$/g
export const EMAIL_SPECIAL_CHARACTERS_REGEX = /^[^!#$%^&*()\]~/}[{=?|"<>',:;]+$/g

export const LATIN_REGEX = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi

export const SOFTWARE_ICONS_LIST = [
  'AlmaLinux',
  'Bitrix',
  'CentOS',
  'Debian',
  'Django',
  'Fedora',
  'FreeBSD',
  'HestiaCP',
  'ISPmanager',
  'LAMP',
  'LEMP',
  'null',
  'Openvpn',
  'Redmine',
  'Teamspeak',
  'Tomcat',
  'Ubuntu',
  'VestaCP',
  'VMmanager',
  'Windows',
  'Rocky',
]
