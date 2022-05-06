// export default function getCurrentTranslation(text, tFunc) {
//   switch (text.trim()) {
//     //Client
//     case 'customer':
//       return tFunc('trusted_users.rights_alert.clients.client')

//     //Profile
//     // case 'clientoption':
//     //   return tFunc('trusted_users.rights_alert.clients.profile.profile')
//     // case 'clientoption#read':
//     //   return tFunc('trusted_users.rights_alert.clients.profile.profile_reading')
//     // case 'clientoption#write':
//     //   return tFunc('trusted_users.rights_alert.clients.profile.profile_writable')

//     // case 'account.discountinfo':
//     //   return tFunc('trusted_users.rights_alert.clients.Discounts')

//     //users
//     // case 'user':
//     //   return tFunc('trusted_users.rights_alert.clients.users.users')
//     // case 'user.edit#create':
//     //   return tFunc('trusted_users.Add')
//     // case 'user.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'user.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'user.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'user.suspend':
//     //   return tFunc('trusted_users.Disable')
//     // case 'rights2.user':
//     //   return tFunc('trusted_users.Permissions')
//     // case 'user.history':
//     //   return tFunc('trusted_users.History')
//     // case 'user.filter#create':
//     //   return tFunc('trusted_users.Filter')
//     // case 'user.edit#read':
//     //   return tFunc('trusted_users.rights_alert.clients.users.edit_reading')
//     // case 'user.edit#write':
//     //   return tFunc('trusted_users.rights_alert.clients.users.edit_writable')
//     // case 'rights2.user.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'rights2.user.suspend':
//     //   return tFunc('trusted_users.Disable') //case 'rights2.user.suspend': return tFunc('Functions') the same key!!! with functions
//     // case 'rights2.user.hardfilter':
//     //   return tFunc('trusted_users.Filter')
//     //payers
//     // case 'profile':
//     //   return tFunc('trusted_users.rights_alert.clients.payers.payers')
//     // case 'profile.add#create':
//     //   return tFunc('trusted_users.Add')
//     // case 'profile.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'profile.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'profile.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'profile.suspend':
//     //   return tFunc('trusted_users.Disable')
//     // case 'profile.reconciliation':
//     //   return tFunc('trusted_users.rights_alert.clients.payers.Reconciliation report')
//     // case 'profile.history':
//     //   return tFunc('trusted_users.History')
//     // case 'profile.filter#create':
//     //   return tFunc('trusted_users.Filter')
//     // case 'profile.edit#read':
//     //   return tFunc('trusted_users.rights_alert.clients.payers.edit_reading')
//     // case 'profile.edit#write':
//     //   return tFunc('trusted_users.rights_alert.clients.payers.edit_writable')
//     // case 'profile.reconciliation#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.payers.Print the reconciliation report_reading',
//     //   )
//     // case 'profile.reconciliation#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.payers.Print the reconciliation report_writable',
//     //   )

//     //affiliate program
//     // case 'affiliate.client':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.affiliate_program.Affiliate_program',
//     //   )
//     // case 'affiliate.client.reward':
//     //   return tFunc('trusted_users.rights_alert.clients.affiliate_program.Reward')
//     // case 'affiliate.client#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.affiliate_program.Affiliate program_reading',
//     //   )
//     // case 'affiliate.client#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.affiliate_program.Affiliate program_writable',
//     //   )
//     // case 'affiliate.client.click':
//     //   return tFunc('trusted_users.Statistics')
//     // case 'affiliate.client.click.filter#create':
//     //   return tFunc('trusted_users.Filter')

//     //basket
//     // case 'basket':
//     //   return tFunc('trusted_users.Cart')
//     // case 'basket#write':
//     //   return tFunc('trusted_users.rights_alert.clients.cart.Cart_writable')
//     // case 'basket#read':
//     //   return tFunc('trusted_users.rights_alert.clients.cart.Cart_reading')

//     //orders
//     // case 'order':
//     //   return tFunc('trusted_users.Orders')
//     // case 'order#read':
//     //   return tFunc('trusted_users.rights_alert.clients.orders.Orders_reading')
//     // case 'order#write':
//     //   return tFunc('trusted_users.rights_alert.clients.orders.Orders_writable')

//     //payment methods
//     // case 'payment.recurring.stored_methods':
//     //   return tFunc('trusted_users.rights_alert.clients.payment_methods.Payment_methods')
//     // case 'payment.recurring.stored_methods.edit#create':
//     //   return tFunc('trusted_users.Add')
//     // case 'payment.recurring.stored_methods.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'payment.recurring.stored_methods.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'payment.recurring.stored_methods.reconfigure':
//     //   return tFunc('trusted_users.rights_alert.clients.payment_methods.Re-configure')
//     // case 'payment.recurring.stored_methods.edit#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.payment_methods.Change the payment method_reading',
//     //   )
//     // case 'payment.recurring.stored_methods.edit#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.clients.payment_methods.Change the payment method_writable',
//     //   )

//     //users settings
//     // case 'usrparam':
//     //   return tFunc('trusted_users.rights_alert.clients.User_settings')
//     // case 'usrparam#read':
//     //   return tFunc('trusted_users.rights_alert.clients.User_settings_reading')
//     // case 'usrparam#write':
//     //   return tFunc('trusted_users.rights_alert.clients.User_settings_writable')

//     //Products/servicess
//     // case 'mainmenuservice':
//     //   return tFunc('trusted_users.rights_alert.products_services.Products/Services')
//     // case 'dedic':
//     //   return tFunc('trusted_users.rights_alert.products_services.Dedicated servers')
//     // case 'vhost':
//     //   return tFunc('trusted_users.rights_alert.products_services.Shared hosting')
//     // case 'vds':
//     //   return tFunc('trusted_users.rights_alert.products_services.Virtual private servers')
//     // case 'wuwuwuw':
//     //   return tFunc('trusted_users.rights_alert.products_services.forexbox')

//     //dedicated servers
//     // case 'dedic.order#create':
//     //   return tFunc('trusted_users.Order')
//     // case 'dedic.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'dedic.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'dedic.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'dedic.suspend':
//     //   return tFunc('trusted_users.Disable')
//     // case 'service.start':
//     //   return tFunc('trusted_users.Start')
//     // case 'service.stop':
//     //   return tFunc('trusted_users.Stop')
//     // case 'service.changepassword':
//     //   return tFunc('trusted_users.Password change')
//     // case 'service.reboot':
//     //   return tFunc('trusted_users.Reboot')
//     // case 'service.hardreboot':
//     //   return tFunc('trusted_users.Hard reboot')
//     // case 'service.ip':
//     //   return tFunc('trusted_users.IP addresses')
//     // case 'service.prolong':
//     //   return tFunc('trusted_users.Renew')
//     // case 'service.changepricelist':
//     //   return tFunc('trusted_users.Change tariff')
//     // case 'service.stat':
//     //   return tFunc('trusted_users.Statistics')
//     // case 'service.history':
//     //   return tFunc('trusted_users.History')
//     // case 'service.instruction.html':
//     //   return tFunc('trusted_users.Instructions')
//     // case 'service.ask':
//     //   return tFunc('trusted_users.Question')
//     // case 'dedic.filter#create':
//     //   return tFunc('trusted_users.Filter')
//     // case 'gotoserver':
//     //   return tFunc('trusted_users.To panel')
//     // case 'dedic.edit#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_reading',
//     //   )
//     // case 'dedic.edit#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_writable',
//     //   )
//     // case 'service.changepassword#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Change password_reading',
//     //   )
//     // case 'service.changepassword#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Change password_writable',
//     //   )
//     // case 'service.ip.edit#create':
//     //   return tFunc('trusted_users.Order')
//     // case 'service.ip.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'service.ip.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'service.ip.history':
//     //   return tFunc('trusted_users.History')
//     // case 'service.ip.edit#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.edit_IP addresses_reading',
//     //   )
//     // case 'service.ip.edit#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.edit_IP addresses_writable',
//     //   )
//     // case 'service.prolong#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Renew the selected service_reading',
//     //   )
//     // case 'service.prolong#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Renew the selected service_writable',
//     //   )
//     // case 'gotoserver#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Go to the control panel_reading',
//     //   )
//     // case 'gotoserver#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Go to the control panel_writable',
//     //   )

//     //share hosting
//     // case 'vhost.order#create':
//     //   return tFunc('trusted_users.Order')
//     // case 'vhost.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'vhost.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'vhost.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'vhost.suspend':
//     //   return tFunc('trusted_users.Disable')
//     // case 'vhost.edit#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_reading',
//     //   )
//     // case 'vhost.edit#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_writable',
//     //   )
//     // case 'vhost.filter#create':
//     //   return tFunc('trusted_users.Filter')

//     //virtual servers
//     // case 'vds.order#create':
//     //   return tFunc('trusted_users.Order')
//     // case 'vds.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'vds.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'vds.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'vds.suspend':
//     //   return tFunc('trusted_users.Disable')
//     // case 'vds.filter#create':
//     //   return tFunc('trusted_users.Filter')
//     // case 'webconsole':
//     //   return tFunc('trusted_users.rights_alert.products_services.Web-console')
//     // case 'vds.edit#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_reading',
//     //   )
//     // case 'vds.edit#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_writable',
//     //   )

//     //Forexbox
//     // case 'wuwuwuw.order#create':
//     //   return tFunc('trusted_users.Order')
//     // case 'wuwuwuw.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'wuwuwuw.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'wuwuwuw.resume':
//     //   return tFunc('trusted_users.Enable')
//     // case 'wuwuwuw.suspend':
//     //   return tFunc('trusted_users.Disable')
//     // case 'wuwuwuw.filter#create':
//     //   return tFunc('trusted_users.Filter')
//     // case 'wuwuwuw.edit#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_reading',
//     //   )
//     // case 'wuwuwuw.edit#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.products_services.services_sub_text.Edit properties of the selected service_writable',
//     //   )

//     //billing
//     // case 'finance':
//     //   return tFunc('trusted_users.rights_alert.billing.Billing')
//     // case 'payment.recurring.settings':
//     //   return tFunc('trusted_users.rights_alert.billing.Auto payment')
//     // case 'payment':
//     //   return tFunc('trusted_users.rights_alert.billing.Payments')
//     // case 'expense':
//     //   return tFunc('trusted_users.rights_alert.billing.Expenses')
//     // case 'promisepayment.add':
//     //   return tFunc('trusted_users.rights_alert.billing.Promised payment')
//     // case 'services.autoprolong':
//     //   return tFunc('trusted_users.rights_alert.billing.Automatic renewal of services')

//     //Auto payment
//     // case 'payment.recurring.settings#read':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.billing.billing_sub_text.Auto payment_reading',
//     //   )
//     // case 'payment.recurring.settings#write':
//     //   return tFunc(
//     //     'trusted_users.rights_alert.billing.billing_sub_text.Auto payment_writable',
//     //   )

//     //payments
//     // case 'payment.add#create':
//     //   return tFunc('trusted_users.Add')
//     // case 'payment.edit':
//     //   return tFunc('trusted_users.Edit')
//     // case 'payment.add.redirect':
//     //   return tFunc('trusted_users.Pay')
//     // case 'payment.delete':
//     //   return tFunc('trusted_users.Delete')
//     // case 'payment.print':
//     //   return tFunc('trusted_users.Print')
//     // case 'payment.print.pdf':
//     //   return tFunc('trusted_users.Download')
//     // case 'payment.orderinfo':
//     //   return tFunc('trusted_users.Details')
//     // case 'payment.history':
//     //   return tFunc('trusted_users.History')
//     // case 'payment.filter#create':
//     //   return tFunc('trusted_users.Filter')

//     //support
//     // case 'support':
//     //   return tFunc('trusted_users.rights_alert.support.Support')
//     // case 'clientticket':
//     //   return tFunc('trusted_users.rights_alert.support.Support tickets')
//     // case 'clientticket_archive':
//     //   return tFunc('trusted_users.rights_alert.support.Archived tickets')
//     // case 'notification':
//     //   return tFunc('trusted_users.rights_alert.support.Notifications')

//     //tools
//     // case 'mainmenutool':
//     //   return tFunc('trusted_users.rights_alert.tools.Tools')
//     // // case 'user.edit':
//     // //   return tFunc('trusted_users.rights_alert.tools.Add a new user')
//     // case 'profile.add':
//     //   return tFunc('trusted_users.rights_alert.tools.Add a payer')

//     //Statistics
//     // case 'stat':
//     //   return tFunc('trusted_users.Statistics')
//     // case 'authlog':
//     //   return tFunc('trusted_users.rights_alert.statistics.Access log')

//     //Help
//     // case 'mgrhelp':
//     //   return tFunc('trusted_users.rights_alert.help.Help')

//     //Dashboard
//     // case 'dashboard':
//     //   return tFunc('trusted_users.rights_alert.dashboard.Dashboard')
//     // case 'dashboard.info':
//     //   return tFunc('trusted_users.rights_alert.dashboard.Information')
//     // case 'dashboard.providers':
//     //   return tFunc('trusted_users.rights_alert.dashboard.Providers')

//     //Promised Payments
//     //Service reselling
//     case 'reselling':
//       return tFunc('trusted_users.rights_alert.reselling_service.Service reselling')
//     case 'availableprice':
//       return tFunc(
//         'trusted_users.rights_alert.reselling_service.Service reselling functions',
//       )
//   }
// }

// //158 stroke pay attention in json
