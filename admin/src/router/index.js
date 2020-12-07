import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from "../views/Main";
import CategoryEdit from "../views/CategoryEdit";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/categories/create',
        component: CategoryEdit
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

export default router
