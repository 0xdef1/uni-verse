import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import UniVerse from '../views/uni-verse.vue'
import ALCX from '../views/alcx.vue'
import SomniumSales from '../views/somnium.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/uni-verse',
    name: 'UNI-verse',
    component: UniVerse
  },
  {
    path: '/alcx',
    name: 'ALCX',
    component: ALCX
  },
  {
    path: '/somnium',
    name: 'SomniumSales',
    component: SomniumSales
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
