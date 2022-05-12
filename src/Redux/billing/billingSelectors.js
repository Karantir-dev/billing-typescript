const getPaymentsList = state => state.billing.paymentsList
const getPaymentsCount = state => state.billing.paymentsCount

const getPaymentsFiltersList = state => state.billing.paymentsFiltersList
const getPaymentsFilters = state => state.billing.paymentsFilters

const getExpensesList = state => state.billing.expensesList
const getExpensesCount = state => state.billing.expensesCount

const getExpensesFiltersList = state => state.billing.expensesFiltersList
const getExpensesFilters = state => state.billing.expensesFilters

export default {
  getPaymentsList,
  getPaymentsCount,

  getPaymentsFiltersList,
  getPaymentsFilters,

  getExpensesList,
  getExpensesCount,

  getExpensesFiltersList,
  getExpensesFilters,
}
