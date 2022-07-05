export default function expensesTranslateFn(str, t) {
  const domainsCount = str.match(/DNS-hosting for (.+?)(?= domains)/)

  let translate = str
    .replace(
      /DNS-hosting for '.+' domains/g,
      t('DNS-hosting for domains', { value: t(domainsCount && domainsCount[1]) }),
    )
    .replace('Month', t('Month', { ns: 'dedicated_servers' }))
    .replace('Three months', t('Three months', { ns: 'Three months' }))
    .replace('Half a year', t('Half a year', { ns: 'dedicated_servers' }))
    .replace('Three years', t('Three years', { ns: 'dedicated_servers' }))
    .replace('Year', t('Year', { ns: 'dedicated_servers' }))
    .replace('Two years', t('Two years', { ns: 'dedicated_servers' }))
    .replace('Three months', t('Three months', { ns: 'dedicated_servers' }))
    .replace('Telematic services', t('Telematic services'))
    .replace('Domain names', t('Domain names'))
    .replace('Site care service', t('Site care service'))
    .replace('Add-on Control panel', t('Add-on Control panel'))
    .replace('Add-on IP-addresses count', t('Add-on IP-addresses count'))
    .replace('Taking care of the server', t('Taking care of the server'))
    .replace('Equipment leasing', t('Equipment leasing'))
    .replace('FTP-storage', t('FTP-storage'))
    .replace('DNS-hosting for', t('DNS-hosting for'))
    .replace('domains', t('domains'))
    .replace('Add-on Disk space', t('Add-on Disk space'))
    .replace('Add-on Memory', t('Add-on Memory'))
    .replace('Add-on CPU count', t('Add-on CPU count'))
    .replace('Payment system commission', t('Payment system commission'))
    .replace(
      'Add-on DDoS Protected Port Speed (Incoming)',
      t('Add-on DDoS Protected Port Speed (Incoming)'),
    )

  return t(translate.trim())
}
