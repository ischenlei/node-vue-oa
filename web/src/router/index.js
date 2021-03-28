import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'
import Home from "@/views/Home";
import Article from '@/views/Article'
import Login from "@/views/Login";
import User from "@/views/User";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {path: '/', name: 'home', component: Home},
      {path: '/user', name: 'user', component: User},
      {path: '/articles/:id', name: 'article', component: Article, props: true},
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
