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

export const PROFILE_TYPES = {
  1: 'Individual',
  2: 'Company',
  3: 'Sole proprietor',
}

export const USERS_WITH_G7 = [
  223794, 63852, 36911, 219929, 54297, 184341, 272533, 173695, 273389, 226462, 173769,
  185469, 275556, 27126, 63612, 53681, 45234, 16460, 247506, 64917, 282368, 283474,
  286337, 273321, 292584, 287390, 216482, 310182, 311383, 310265, 236409, 195196, 172396,
  20637, 172783, 322067, 291655, 25554, 183395, 319027, 330769, 210811, 52166, 313942,
  192404, 216627, 38062, 334840, 342702, 63987, 312263, 37703, 335011, 310434, 259663,
  274113, 294079, 186547, 340239, 232138, 344820, 338355, 316389, 345759, 268206, 237556,
  274583, 324820, 196224, 348507, 272182, 349421, 57917, 350383, 51998, 18660, 65874,
  40119, 294149, 351789, 48926, 265822, 184439, 243327, 308121, 335166, 255822, 357033,
  316073, 358174, 358199, 357954, 359229, 328553, 359441, 288392, 41803, 360706, 360982,
  216377, 183382, 361793, 335326, 361909, 361952, 362236, 34450, 257388, 363389, 356163,
  346720, 252023, 351211, 363975, 364041, 364067, 334169, 36971, 366046, 40520, 367015,
  354039, 365250, 359551, 343138, 368290, 363037, 
  // this is test account id:
  370352,
]
