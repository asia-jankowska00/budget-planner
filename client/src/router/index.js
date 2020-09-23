import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Source from '../views/Source.vue';
import Budget from '../views/Budget.vue';
import Profile from '../views/Profile.vue';
import BudgetEdit from '../views/BudgetEdit.vue';
import SourceEdit from '../views/SourceEdit.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: 'sources',
        name: 'Sources',
        component: Source
      },
      {
        path: 'sources/:id/edit',
        name: 'SourceEdit',
        component: SourceEdit,
      },
      {
        path: 'budgets',
        name: 'Budgets',
        component: Budget,
      },
      {
        path: 'budgets/:id/edit',
        name: 'BudgetEdit',
        component: BudgetEdit,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
