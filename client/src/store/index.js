import Vue from 'vue'
import Vuex from 'vuex'
import sources from './modules/sources'
import budgets from './modules/budgets'
import modals from './modules/modals'
import user from './modules/user'
import currencies from  './modules/currencies'
import transactions from  './modules/transactions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sources,
    budgets,
    modals,
    user,
    currencies,
    transactions
  }
})
