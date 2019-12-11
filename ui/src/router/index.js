import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      requiresAuth: true,
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/Dashboard.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      requiresGuest: true,
    },
    component: () => import(/* webpackChunkName: "login" */ '../components/Auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      requiresGuest: true,
    },
    component: () => import(/* webpackChunkName: "register" */ '../components/Auth/Register.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  try {
    const isAuthenticated = await store.dispatch('isAuthenticated');
    console.log(isAuthenticated);
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({
          path: '/login',
        })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (isAuthenticated) {
        if (from.matched.length) {
          next(false)
        } else {
          next({
            path: '/'
          })
        }
      } else {
        next()
      }
    } else {
      next() // make sure to always call next()!
    }
  } catch (error) {
    next({
      path: '/', // back to safety route //
    })
  }
})

export default router
