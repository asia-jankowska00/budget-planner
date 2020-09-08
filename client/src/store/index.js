import Vue from 'vue'
import Vuex from 'vuex'
import sources from './modules/sources'
import budgets from './modules/budgets'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    sources,
    budgets
  }
})
