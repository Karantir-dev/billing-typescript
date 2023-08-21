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
const getIsLoadingPayment = state => state.billing.isLoadingPayment
const getIsLoadingPaymentMethod = state => state.billing.isLoadingPaymentMethod
const getIsLoadingAutoPayment = state => state.billing.isLoadingAutoPayment
const getIsLoadingExpenses = state => state.billing.isLoadingExpenses

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
  getIsLoadingPayment,
  getIsLoadingAutoPayment,
  getIsLoadingExpenses,
  getIsLoadingPaymentMethod,
}
