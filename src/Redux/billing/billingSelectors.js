const getPaymentsList = state => state.billing.paymentsList
const getPaymentsCount = state => state.billing.paymentsCount

const getPaymentsFiltersList = state => state.billing.paymentsFiltersList
const getPaymentsFilters = state => state.billing.paymentsFilters

const getExpensesList = state => state.billing.expensesList
const getExpensesCount = state => state.billing.expensesCount

export default {
  getPaymentsList,
  getPaymentsCount,

  getPaymentsFiltersList,
  getPaymentsFilters,

  getExpensesList,
  getExpensesCount,
}
