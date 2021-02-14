import axios from 'axios'
import Vue from 'vue'
import router from "@/router";

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

http.interceptors.request.use((config) => {
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

http.interceptors.response.use(res => {
  return res
}, err => {
  //大于等于400的错误都会在这里
  if (err.response.data.message) {
    Vue.prototype.$message.error({
      type: 'error',
      message: err.response.data.message
    })
    if (err.response.status === 401) {
      router.push('/login')
    }
  }
  return Promise.reject(err)
})

export default http
