export const DOMAIN_REGEX =
  /^(?!-)(?:[a-zA-Z\d-]{0,62}[a-zA-Z\d]\.){1,126}(?!\d+)[a-zA-Z\d]{1,63}$/g

export const SPECIAL_CHARACTERS_REGEX = /^[^!#$%^&*()\]~/}[{=?|"<>',+:;]+$/g
export const EMAIL_SPECIAL_CHARACTERS_REGEX = /^[^!#$%^&*()\]~/}[{=?|"<>',:;]+$/g
export const CYRILLIC_ALPHABET_PROHIBITED = /^[^Ѐ-ӏ]+$/g

export const LATIN_REGEX = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi
export const LATIN_NUMBER_REGEX = /^([A-Za-z0-9\s]*)$/g

export const PASS_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\x20-\x7E]+$/

export const URL_REGEX =
  /^(?:https?:\/\/)(?:www\.)?[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/

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

// phone countries for yookassa payment method (QIWI)
export const QIWI_PHONE_COUNTRIES = [
  'am',
  'az',
  'in',
  'ru',
  'kz',
  'gb',
  'ge',
  'lt',
  'tj',
  'th',
  'uz',
  'pa',
  'lv',
  'tr',
  'md',
  'il',
  'vn',
  'ee',
  'kr',
  'kg',
]

// phone countries for yookassa payment method (SberPay)
export const SBER_PHONE_COUNTRIES = ['ru']

// VDS ids

export const VDS_IDS_LIKE_DEDICS = ['6322', '6334']
export const VDS_IDS_TO_ORDER = ['6322']

export const WORDPRESS_VHOST = ['6346', '6349', '6352', '6361']

export const OFFER_FIELD = 'offer_3'
