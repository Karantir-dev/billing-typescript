export const DOMAIN_REGEX =
  /^(?!-)(?:[a-zA-Z\d-]{1,62}[a-zA-Z\d]\.){1,126}(?!\d+)[a-zA-Z\d]{2,63}$/g

export const SPECIAL_CHARACTERS_REGEX = /^[^!#$%^&*()\]~/}[{=?|"<>',+:;]+$/g
export const EMAIL_SPECIAL_CHARACTERS_REGEX = /^[^!#$%^&*()\]~/}[{=?|"<>',:;]+$/g
export const CYRILLIC_ALPHABET_PROHIBITED = /^[^Ѐ-ӏ]+$/g

export const LATIN_REGEX = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi
export const LATIN_NUMBER_REGEX = /^([A-Za-z0-9\s]*)$/g

export const SSH_KEY_NAME_REGEX = /^[A-Za-z0-9\s\-_-]+$/

export const INDEX_REGEX = /^(?:[A-Za-z]{2,3}-?\d+|[a-zA-Z0-9]+)$/

export const PASS_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/
export const PASS_REGEX_ASCII = /^[\x20-\x7E]+$/
export const DISALLOW_SPACE = /^\S*$/
export const DISALLOW_PASS_SPECIFIC_CHARS = /^(?!.*["#%&'()*;<>?@|]).+$/

export const URL_REGEX =
  /^(?:https?:\/\/)(?:www\.)?[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/

export const ADDRESS_REGEX = /^(?=.*\p{L})(?=.*[0-9]).*$/u
export const ADDRESS_SPECIAL_CHARACTERS_REGEX = /^[^!$%^&\]~}[{=?<>+]+$/g

export const CNP_REGEX = /^\d{13}$/

export const SOFTWARE_ICONS_LIST = [
  'almalinux',
  'bitrix',
  'centos',
  'debian',
  'django',
  'fedora',
  'freebsd',
  'hestiacp',
  'ispmanager',
  'lamp',
  'lemp',
  'null',
  'openvpn',
  'redmine',
  'teamspeak',
  'tomcat',
  'ubuntu',
  'vestacp',
  'vmmanager',
  'windows',
  'rocky',
  'oracle',
  'nagios',
  'wireguard',
  'zabbix',
  'chrome',
  'astralinux',
  'proxmox',
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

export const VDS_IDS_LIKE_DEDICS = ['6322', '6334', '6370']
export const VDS_IDS_TO_ORDER = ['6322', '6370']

export const NEW_DEDICS = ['Config 71', 'Config 72']

export const WORDPRESS_VHOST = ['6346', '6349', '6352', '6361']

export const OFFER_FIELD = 'offer_4'

export const PROFILE_TYPES = {
  1: 'Individual',
  2: 'Company',
  3: 'Sole proprietor',
}

export const PRODUCTION_DOMAIN = 'cp.zomro.com'

export const SOC_NET = {
  google: 'google',
  vkontakte: 'vkontakte',
  facebook: 'facebook',
}

export const GOOGLE_LOGIN_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=google'

export const GOOGLE_REGISTRATION_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=google&project=4&currency=153&rparams='

export const FACEBOOK_LOGIN_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=facebook'

export const FACEBOOK_REGISTRATION_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=facebook&project=4&currency=153&rparams='

export const VK_LOGIN_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=vkontakte'

export const VK_REGISTRATION_LINK =
  'https://api.zomro.com/billmgr?func=oauth.redirect&newwindow=yes&network=vkontakte&project=4&currency=153&rparams='

export const RUS_LANG_COUNTRIES = [
  'AZ',
  'AM',
  'BY',
  'KG',
  'LV',
  'LT',
  'MD',
  'RU',
  'TJ',
  'TM',
  'UZ',
  'EE',
  'KZ',
  'GE',
]

/** ID of promotion "1 month of hosting for free" for Affordable tariff */
export const FIRST_MONTH_HOSTING_DISCOUNT_ID = '6041'

export const DEDIC_FILTER_RANGE_GROUPS = ['cpucores']

export const DC_ID_IN = { poland: 13, netherlands: 12 }

export const CLOUD_SORT_LIST = [
  { label: 'Name', isSort: true, value: 'servername' },
  { label: 'Status', isSort: true, value: 'instance_status' },
  { label: 'Flavor', isSort: true, value: 'pricelist' },
  { label: 'Price', isSort: true, value: 'cost' },
  { label: 'Region', isSort: true, value: 'datacentername' },
  { label: 'Created at', isSort: true, value: 'createdate' },
  { label: 'OS', isSort: true, value: 'instances_os' },
  { label: 'Access IP', isSort: true, value: 'ip' },
]

export const FOTBO_STATUSES_LIST = [
  {
    $key: '',
    $: 'Not selected',
  },
  {
    $key: 'active',
    $: 'Active',
  },
  {
    $key: 'stopped',
    $: 'Stopped',
  },
  {
    $key: 'verify_resize',
    $: 'Verify Resize',
  },
  {
    $key: 'suspend',
    $: 'Suspended',
  },
]

export const TARIFFS_PRICES = {
  'Cloud Essential': { day: 0.13, month: 3.9 },
  'Cloud Standard': { day: 0.1634, month: 4.9 },
  'Cloud Exclusive': { day: 0.2497, month: 7.49 },
  'Cloud Prime': { day: 0.4497, month: 13.49 },
  'Cloud Platinum': { day: 0.6634, month: 19.9 },
  'Cloud Enterprise': { day: 1.283, month: 38.49 },
  'Cloud Ultimate': { day: 2.2164, month: 66.49 },
  /** With cyrylic C (temporarily) */
  'Сloud Ultimate': { day: 2.2164, month: 66.49 },
  'Cloud Supreme': { day: 2.9967, month: 89.9 },

  /* BASIC tariffs */
  'Cloud Starter': { day: 0.0966, month: 2.9 },
  'Cloud Optimal': { day: 0.183, month: 5.49 },
  'Cloud Nova': { day: 0.3164, month: 9.49 },
  'Cloud Pro': { day: 0.5497, month: 16.49 },
  'Cloud Max': { day: 1.03, month: 30.9 },
}

/* ID of services that should be disabled: */
export const FORBIDDEN_TO_ORDER_SERVICES = [27090, 6, 27140, 27129]

/*
Below ID and names of all services

"id_itemtype": "name"
"4": "Domain names"
"6": "Virtual server"
"20": "Dedicated server"
"23": "Shared hosting"
"41": "Slave name server"
"27090": "External FTP-storage "
"27129": "Site care service"
"27136": "Forex server"
"27140": "VPN"
"27156": "Instances"
*/

export const PREMIUM_TYPE = 'premium'
export const BASIC_TYPE = 'basic'
