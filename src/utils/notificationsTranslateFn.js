export default function notificationsTranslateFn(str, t) {
  const serviceReadyForUse = str.match(/Service "(.+?)(?=" is ready for use)/)?.[1]
  const serviceHasBeenDeleted = str.match(/Service "(.+?)(?=" has been deleted)/)?.[1]
  const serviceHasBeenSuspended = str.match(/Service "(.+?)(?=" has been suspended)/)?.[1]
  const serviceProlonged = str.match(/Service "(.+?)(?=" has been prolonged)/)?.[1]
  const serviceHasBeenModified = str.match(/Service "(.+?)(?=" has been modified)/)?.[1]
  const serviceHasBeenActivated = str.match(/Service "(.+?)(?=" has been activated)/)?.[1]
  const failedDomainTransfer = str.match(/Failed to transfer the "(.+?)(?=" domain)/)?.[1]
  const changePriceList = str.match(
    /An error occurred when changing the tariff of "(.+?)(?=" Your old tariff plan has been activated)/,
  )?.[1]
  const failedToRegisterCertificate = str.match(
    /Failed to register the "(.+?)(?=" SSL-certificate)/,
  )?.[1]
  const successTransferedDomain = str.match(
    /The "(.+?)(?=" domain has been successfully transferred)/,
  )?.[1]
  const errorIndDomainContacts = str.match(
    /Error in domain contacts for the service "(.+?)(?=. Check parameters and repeat the operation)/,
  )?.[1]
  const errorIndDomainServers = str.match(
    /An error occurred when changing name servers of the "(.+?)(?=" service. Check parameters and try again)/,
  )?.[1]
  const passwordHasBeenChanged = str.match(
    /Password for "(.+?)(?=" has been changed)/,
  )?.[1]
  const nameServersChanged = str.match(
    /Name servers for "(.+?)(?=" have been successfully changed)/,
  )?.[1]
  const errorInDomainContacts = str.match(
    /Error in domain contacts for the service "(.+?)(?=".)/,
  )?.[1]

  let translate = str
    .replace(
      /Service ".+" is ready for use/g,
      t('Service is ready for use', { value: t(serviceReadyForUse), ns: 'container' }),
    )
    .replace(
      /Service ".+" has been deleted/g,
      t('Service has been deleted', { value: t(serviceHasBeenDeleted), ns: 'container' }),
    )
    .replace(
      /Service ".+" has been suspended/g,
      t('Service has been suspended', {
        value: t(serviceHasBeenSuspended),
        ns: 'container',
      }),
    )
    .replace(
      /Service ".+" has been prolonged/g,
      t('Service has been prolonged', {
        value: t(serviceProlonged),
        ns: 'container',
      }),
    )
    .replace(
      /Service ".+" has been modified/g,
      t('Service has been modified', {
        value: t(serviceHasBeenModified),
        ns: 'container',
      }),
    )
    .replace(
      /Service ".+" has been activated/g,
      t('Service has been activated', {
        value: t(serviceHasBeenActivated),
        ns: 'container',
      }),
    )
    .replace(
      /Failed to transfer the ".+" domain/g,
      t('Failed to transfer the domain', {
        value: t(failedDomainTransfer),
        ns: 'container',
      }),
    )
    .replace(
      /An error occurred when changing the tariff of ".+" Your old tariff plan has been activated/g,
      t('Change pricelist', {
        value: t(changePriceList),
        ns: 'container',
      }),
    )
    .replace(
      /Failed to register the ".+" SSL-certificate/g,
      t('Failed to register the SSL-certificate', {
        value: t(failedToRegisterCertificate),
        ns: 'container',
      }),
    )
    .replace(
      /The ".+" domain has been successfully transferred/g,
      t('The domain has been successfully transferred', {
        value: t(successTransferedDomain),
        ns: 'container',
      }),
    )
    .replace(
      /Error in domain contacts for the service ".+" Check parameters and repeat the operation/g,
      t('Error in domain contacts for the service', {
        value: t(errorIndDomainContacts),
        ns: 'container',
      }),
    )
    .replace(
      /An error occurred when changing name servers of the ".+" service. Check parameters and try again/g,
      t('An error occurred when changing name servers', {
        value: t(errorIndDomainServers),
        ns: 'container',
      }),
    )
    .replace(
      /Password for ".+" has been changed/g,
      t('Password for has been changed', {
        value: t(passwordHasBeenChanged),
        ns: 'container',
      }),
    )
    .replace(
      /Name servers for ".+" have been successfully changed/g,
      t('Name servers for have been successfully changed', {
        value: t(nameServersChanged),
        ns: 'container',
      }),
    )
    .replace(
      /Error in domain contacts for the service ".+"/g,
      t('Error in domain contacts for the service', {
        value: t(errorInDomainContacts),
        ns: 'container',
      }),
    )
    .replace(
      'Check parameters and repeat the operation',
      t('Check parameters and repeat the operation', { ns: 'container' }),
    )

  return t(translate.trim())
}
