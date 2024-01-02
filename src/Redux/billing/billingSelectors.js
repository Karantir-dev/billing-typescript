const getPaymentsList = state => state.billing.paymentsList
const getPaymentsCount = state => state.billing.paymentsCount

const getPaymentsReadOnlyList = state => state.billing.paymentsReadOnlyList
const getPaymentsReadOnlyCount = state => state.billing.paymentsReadOnlyCount

const getPaymentsFiltersList = state => state.billing.paymentsFiltersList
const getPaymentsFilters = state => state.billing.paymentsFilters

const getExpensesList = state => state.billing.expensesList
const getExpensesCount = state => state.billing.expensesCount

const getExpensesFiltersList = state => state.billing.expensesFiltersList
const getExpensesFilters = state => state.billing.expensesFilters

const getPaymentsMethodList = state => state.billing.paymentsMethodList
const getPaymentsCurrencyList = state => state.billing.paymentsCurrencyList

const getAutoPaymentsList = state => state.billing.autoPaymentsList
const getAutoPaymentConfig = state => state.billing.autoPaymentConfig

const getPaymentMethodList = state => state.billing.paymentMethodList
const getPaymentMethodCount = state => state.billing.paymentMethodCount

const getPeriodValue = state => state.billing.periodValue
const getIsStripeAvailable = state => state.billing.isStripeAvailable
const getIsModalCreatePaymentOpened = state => state.billing.isModalCreatePaymentOpened
const getPaymentData = state => state.billing.paymentData

export default {
  getPaymentsList,
  getPaymentsCount,

  getPaymentsReadOnlyList,
  getPaymentsReadOnlyCount,

  getPaymentsFiltersList,
  getPaymentsFilters,

  getExpensesList,
  getExpensesCount,

  getExpensesFiltersList,
  getExpensesFilters,

  getPaymentsMethodList,
  getPaymentsCurrencyList,

  getAutoPaymentsList,
  getAutoPaymentConfig,

  getPaymentMethodList,
  getPaymentMethodCount,

  getPeriodValue,
  getIsStripeAvailable,
  getIsModalCreatePaymentOpened,
  getPaymentData,
}
