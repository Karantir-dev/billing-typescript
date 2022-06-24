export default function historyTranslateFn(str, t) {
  const changedResource = str.match(/The resource '(.+?)(?=' has been changed)/)?.[1]

  const newValueForResource = str.match(/A new value is set for \s'(.+?)(?='\.)/)?.[1]

  let translate = str
    .replace(
      /The resource '.+' has been changed/g,
      t('The resource has been changed', { value: t(changedResource) }),
    )
    .replace(
      /A new value is set for .+?\./g,
      t('A new value is set for', { value: t(newValueForResource) }),
    )
    .replace('Tariff add-on has been modified', t('Tariff add-on has been modified'))
    .replace('Old tariff', t('Old tariff'))
    .replace('New tariff', t('New tariff'))
    .replace('The tariff plan has been changed', t('The tariff plan has been changed'))
    .replace('The old plan', t('The old plan'))
    .replace('The new plan', t('The new plan'))
    .replace(
      'The reboot process is started',
      t('The reboot process is started', { ns: 'dedicated_servers' }),
    )
    .replace(
      'Auto-renewal period is set to',
      t('Auto-renewal period is set to', { ns: 'dedicated_servers' }),
    )
    .replace('Month', t('Month', { ns: 'dedicated_servers' }))
    .replace('Three months', t('Three months', { ns: 'Three months' }))
    .replace('Half a year', t('Half a year', { ns: 'dedicated_servers' }))
    .replace('Three years', t('Three years', { ns: 'dedicated_servers' }))
    .replace('Year', t('Year', { ns: 'dedicated_servers' }))
    .replace('Two years', t('Two years', { ns: 'dedicated_servers' }))
    .replace(
      'Automatic renewal is disabled',
      t('Automatic renewal is disabled', { ns: 'dedicated_servers' }),
    )
    .replace(
      'The service validity period has been changed',
      t('The service validity period has been changed', { ns: 'dedicated_servers' }),
    )
    .replace('The old value', t('The old value', { ns: 'dedicated_servers' }))
    .replace('The new value', t('The new value', { ns: 'dedicated_servers' }))
    .replace(
      'The service status has been changed to',
      t('The service status has been changed to', { ns: 'dedicated_servers' }),
    )
    .replace(
      'The new service validity period was set',
      t('The new service validity period was set', { ns: 'dedicated_servers' }),
    )
    .replace(/'Pending'/g, t('Pending', { ns: 'dedicated_servers' }))
    .replace(/'Active'/g, t('Active', { ns: 'dedicated_servers' }))
    .replace(/'Suspended'/g, t('Suspended', { ns: 'dedicated_servers' }))
    .replace('The parameter', t('The parameter', { ns: 'dedicated_servers' }))
    .replace('has been changed', t('has been changed', { ns: 'dedicated_servers' }))
    .replace('Activation date', t('Activation date', { ns: 'dedicated_servers' }))
    .replace('New value', t('New value', { ns: 'dedicated_servers' }))
    .replace('Username', t('Username', { ns: 'dedicated_servers' }))
    .replace('Ordered', t('Ordered', { ns: 'dedicated_servers' }))
    .replace('Three months', t('Three months', { ns: 'dedicated_servers' }))
    .replace(
      'is binded to a service',
      t('is binded to a service', { ns: 'dedicated_servers' }),
    )
    .replace('Old value', t('Old value', { ns: 'dedicated_servers' }))
    .replace(
      'will be deleted from a service',
      t('will be deleted from a service', { ns: 'dedicated_servers' }),
    )
    .replace('Unit', t('Unit', { ns: 'dedicated_servers' }))
    .replace('Add-on for', t('Add-on for', { ns: 'dedicated_servers' }))
    .replaceAll(
      'IP-addresses count',
      t('IP-addresses count', { ns: 'dedicated_servers' }),
    )
    .replace('addresses', t('addresses', { ns: 'dedicated_servers' }))
    .replace('address', t('address', { ns: 'dedicated_servers' }))
    .replace('Without a license', t('Without a license', { ns: 'dedicated_servers' }))
    .replace('Domain name', t('Domain name', { ns: 'dedicated_servers' }))
    .replace('Operating system', t('Operating system', { ns: 'dedicated_servers' }))
    .replace(
      'Preinstalled software',
      t('Preinstalled software', { ns: 'dedicated_servers' }),
    )
    .replaceAll('Control panel', t('Control panel', { ns: 'dedicated_servers' }))
    .replace(
      'A new value is set for',
      t('A new value is set for', { ns: 'dedicated_servers' }),
    )

  return t(translate.trim())
}
