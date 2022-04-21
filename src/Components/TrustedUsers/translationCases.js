export default function getCurrentTranslation(text, tFunc) {
  switch (text.trim()) {
    //Client
    case 'customer':
      return tFunc('trusted_users.rights_alert.clients.client')

    //Profile
    case 'clientoption':
      return tFunc('trusted_users.rights_alert.clients.profile.profile')
    case 'clientoption#read':
      return tFunc('trusted_users.rights_alert.clients.profile.profile_reading')
    case 'clientoption#write':
      return tFunc('trusted_users.rights_alert.clients.profile.profile_writable')

    case 'account.discountinfo':
      return tFunc('trusted_users.rights_alert.clients.Discounts')

    //users
    case 'user':
      return tFunc('trusted_users.rights_alert.clients.users.users')
    case 'user.edit#create':
      return tFunc('Add', { ns: 'other' })
    case 'user.edit':
      return tFunc('Edit', { ns: 'other' })
    case 'user.delete':
      return tFunc('Delete', { ns: 'other' })
    case 'user.resume':
      return tFunc('Enable', { ns: 'other' })
    case 'user.suspend':
      return tFunc('Disable', { ns: 'other' })
    case 'rights2.user':
      return tFunc('Permissions', { ns: 'other' })
    case 'user.history':
      return tFunc('History', { ns: 'other' })
    case 'user.filter#create':
      return tFunc('Filter', { ns: 'other' })
    case 'user.edit#read':
      return tFunc('trusted_users.rights_alert.clients.users.edit_reading')
    case 'user.edit#write':
      return tFunc('trusted_users.rights_alert.clients.users.edit_writable')
    case 'rights2.user.resume':
      return tFunc('Enable', { ns: 'other' })
    case 'rights2.user.suspend':
      return tFunc('Disable', { ns: 'other' }) //case 'rights2.user.suspend': return tFunc('Functions', { ns: 'other' }) the same key!!! with functions
    case 'rights2.user.hardfilter':
      return tFunc('Filter', { ns: 'other' })

    //payers
    case 'profile':
      return tFunc('trusted_users.rights_alert.clients.payers.payers')
    case 'profile.add#create':
      return tFunc('Add', { ns: 'other' })
    case 'profile.edit':
      return tFunc('Edit', { ns: 'other' })
    case 'profile.delete':
      return tFunc('Delete', { ns: 'other' })
    case 'profile.resume':
      return tFunc('Enable', { ns: 'other' })
    case 'profile.suspend':
      return tFunc('Disable', { ns: 'other' })
    case 'profile.reconciliation':
      return tFunc('trusted_users.rights_alert.clients.payers.Reconciliation report')
    case 'profile.history':
      return tFunc('History', { ns: 'other' })
    case 'profile.filter#create':
      return tFunc('Filter', { ns: 'other' })
    case 'profile.edit#read':
      return tFunc('trusted_users.rights_alert.clients.payers.edit_reading')
    case 'profile.edit#write':
      return tFunc('trusted_users.rights_alert.clients.payers.edit_writable')
    case 'profile.reconciliation#read':
      return tFunc(
        'trusted_users.rights_alert.clients.payers.Print the reconciliation report_reading',
      )
    case 'profile.reconciliation#write':
      return tFunc(
        'trusted_users.rights_alert.clients.payers.Print the reconciliation report_writable',
      )

    //affiliate program
    case 'affiliate.client':
      return tFunc(
        'trusted_users.rights_alert.clients.affiliate_program.Affiliate_program',
      )
    case 'affiliate.client.reward':
      return tFunc('trusted_users.rights_alert.clients.affiliate_program.Reward')
    case 'affiliate.client#read':
      return tFunc(
        'trusted_users.rights_alert.clients.affiliate_program.Affiliate program_reading',
      )
    case 'affiliate.client#write':
      return tFunc(
        'trusted_users.rights_alert.clients.affiliate_program.Affiliate program_writable',
      )
    case 'affiliate.client.click':
      return tFunc('Statistics', { ns: 'other' })
    case 'affiliate.client.click.filter#create':
      return tFunc('Filter', { ns: 'other' })

    //basket
    case 'basket':
      return tFunc('Cart', { ns: 'other' })
    case 'basket#write':
      return tFunc('trusted_users.rights_alert.clients.cart.Cart_writable')
    case 'basket#read':
      return tFunc('trusted_users.rights_alert.clients.cart.Cart_reading')

    //orders
    case 'order':
      return tFunc('Orders', { ns: 'other' })
    case 'order#read':
      return tFunc('trusted_users.rights_alert.clients.orders.Orders_reading')
    case 'order#write':
      return tFunc('trusted_users.rights_alert.clients.orders.Orders_writable')

    //payment methods
    case 'payment.recurring.stored_methods':
      return tFunc('trusted_users.rights_alert.clients.payment_methods.Payment_methods')
    case 'payment.recurring.stored_methods.edit#create':
      return tFunc('Add', { ns: 'other' })
    case 'payment.recurring.stored_methods.edit':
      return tFunc('Edit', { ns: 'other' })
    case 'payment.recurring.stored_methods.delete':
      return tFunc('Delete', { ns: 'other' })
    case 'payment.recurring.stored_methods.reconfigure':
      return tFunc('trusted_users.rights_alert.clients.payment_methods.Re-configure')
    case 'payment.recurring.stored_methods.edit#read':
      return tFunc(
        'trusted_users.rights_alert.clients.payment_methods.Change the payment method_reading',
      )
    case 'payment.recurring.stored_methods.edit#write':
      return tFunc(
        'trusted_users.rights_alert.clients.payment_methods.Change the payment method_writable',
      )

    //users settings
    case 'usrparam':
      return tFunc('trusted_users.rights_alert.clients.User_settings')
    case 'usrparam#read':
      return tFunc('trusted_users.rights_alert.clients.User_settings_reading')
    case 'usrparam#write':
      return tFunc('trusted_users.rights_alert.clients.User_settings_writable')

    //Products/servicess
    case 'mainmenuservice':
      return tFunc('trusted_users.rights_alert.products_services.Products/Services')
    case 'dedic':
      return tFunc('trusted_users.rights_alert.products_services.Dedicated servers')
    case 'vhost':
      return tFunc('trusted_users.rights_alert.products_services.Shared hosting')
    case 'vds':
      return tFunc('trusted_users.rights_alert.products_services.Virtual private servers')
    case 'wuwuwuw':
      return tFunc('trusted_users.rights_alert.products_services.forexbox')

    //dedicated servers
    case 'dedic.order#create':
      return tFunc('Order', { ns: 'other' })
    case 'dedic.edit':
      return tFunc('Edit', { ns: 'other' })
    case 'dedic.delete':
      return tFunc('Delete', { ns: 'other' })
    case 'dedic.resume':
      return tFunc('Enable', { ns: 'other' })
    case 'dedic.suspend':
      return tFunc('Disable', { ns: 'other' })
    case 'service.start':
      return tFunc('Start', { ns: 'other' })
    case 'service.stop':
      return tFunc('Stop', { ns: 'other' })
    case 'service.changepassword':
      return tFunc('Password change', { ns: 'other' })
    case 'service.reboot':
      return tFunc('Reboot', { ns: 'other' })
    case 'service.hardreboot':
      return tFunc('Hard reboot', { ns: 'other' })
    case 'service.ip':
      return tFunc('IP addresses', { ns: 'other' })
    case 'service.prolong':
      return tFunc('Renew', { ns: 'other' })
    case 'service.changepricelist':
      return tFunc('Change tariff', { ns: 'other' })
    case 'service.stat':
      return tFunc('Statistics', { ns: 'other' })
    case 'service.history':
      return tFunc('History', { ns: 'other' })
    case 'service.instruction.html':
      return tFunc('Instructions', { ns: 'other' })
    case 'service.ask':
      return tFunc('Question', { ns: 'other' })
    case 'dedic.filter#create':
      return tFunc('Filter', { ns: 'other' })
    case 'gotoserver':
      return tFunc('To panel', { ns: 'other' })
    case 'dedic.edit#read':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_reading',
      )
    case 'dedic.edit#write':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_writable',
      )
    case 'service.changepassword#read':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Change password_reading',
      )
    case 'service.changepassword#write':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Change password_writable',
      )
    case 'service.ip.edit#create':
      return tFunc('Order', { ns: 'other' })
    case 'service.ip.edit':
      return tFunc('Edit', { ns: 'other' })
    case 'service.ip.delete':
      return tFunc('Delete', { ns: 'other' })
    case 'service.ip.history':
      return tFunc('History', { ns: 'other' })
    case 'service.ip.edit#read':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.edit_IP addresses_reading',
      )
    case 'service.ip.edit#write':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.edit_IP addresses_writable',
      )
    case 'service.prolong#read':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Renew the selected service_reading',
      )
    case 'service.prolong#write':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Renew the selected service_writable',
      )
    case 'gotoserver#read':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Go to the control panel_reading',
      )
    case 'gotoserver#write':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Go to the control panel_writable',
      )

    //share hosting
    case 'vhost.order#create':
      return tFunc('Order', { ns: 'other' })
    case 'vhost.edit':
      return tFunc('Edit', { ns: 'other' })
    case 'vhost.delete':
      return tFunc('Delete', { ns: 'other' })
    case 'vhost.resume':
      return tFunc('Enable', { ns: 'other' })
    case 'vhost.suspend':
      return tFunc('Disable', { ns: 'other' })
    case 'vhost.edit#read':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_reading',
      )
    case 'vhost.edit#write':
      return tFunc(
        'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_writable',
      )
    case 'vhost.filter#create':
      return tFunc('Filter', { ns: 'other' })

    //billing
    case 'finance':
      return tFunc('trusted_users.rights_alert.billing.Billing')
    case 'payment.recurring.settings':
      return tFunc('trusted_users.rights_alert.billing.Auto payment')
    case 'payment':
      return tFunc('trusted_users.rights_alert.billing.Payments')
    case 'expense':
      return tFunc('trusted_users.rights_alert.billing.Expenses')
    case 'promisepayment.add':
      return tFunc('trusted_users.rights_alert.billing.Promised payment')
    case 'services.autoprolong':
      return tFunc('trusted_users.rights_alert.billing.Automatic renewal of services')

    //support
    case 'support':
      return tFunc('trusted_users.rights_alert.support.Support')
    case 'clientticket':
      return tFunc('trusted_users.rights_alert.support.Support tickets')
    case 'clientticket_archive':
      return tFunc('trusted_users.rights_alert.support.Archived tickets')
    case 'notification':
      return tFunc('trusted_users.rights_alert.support.Notifications')

    //tools
    case 'mainmenutool':
      return tFunc('trusted_users.rights_alert.tools.Tools')
    // case 'user.edit':
    //   return tFunc('trusted_users.rights_alert.tools.Add a new user')
    case 'profile.add':
      return tFunc('trusted_users.rights_alert.tools.Add a payer')

    //Statistics
    case 'stat':
      return tFunc('Statistics')
    case 'authlog':
      return tFunc('trusted_users.rights_alert.statistics.Access log')

    //Help
    case 'mgrhelp':
      return tFunc('trusted_users.rights_alert.help.Help')

    //Dashboard
    case 'dashboard':
      return tFunc('trusted_users.rights_alert.dashboard.Dashboard')
    case 'dashboard.info':
      return tFunc('trusted_users.rights_alert.dashboard.Information')
    case 'dashboard.providers':
      return tFunc('trusted_users.rights_alert.dashboard.Providers')

    //Promised Payments
    //Service reselling
    case 'reselling':
      return tFunc('trusted_users.rights_alert.reselling_service.Service reselling')
    case 'availableprice':
      return tFunc(
        'trusted_users.rights_alert.reselling_service.Service reselling functions',
      )
  }
}
