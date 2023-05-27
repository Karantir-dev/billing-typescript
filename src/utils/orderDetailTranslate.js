export default function orderDetailTranslate(str, t) {
  return str
    .replace('Order details', t('Order Details', { ns: 'domains' }))
    .replace('base price', t('base price', { ns: 'domains' }))
    .replace('per month', t('per month', {ns: 'autoprolong'}))
    .replace('for three months', t('for three months', {ns: 'autoprolong'}))
    .replace('for three months', t('for three months', {ns: 'autoprolong'}))
    .replace('half a year', t('half a year', {ns: 'autoprolong'}))
    .replace('per year', t('per year', {ns: 'autoprolong'}))
    .replace('for two years', t('for two years', {ns: 'autoprolong'}))
    .replace('for three years', t('for three years', {ns: 'autoprolong'}))
    .replace('Total amount', t('Total amount', {ns: 'domains'}))
}
