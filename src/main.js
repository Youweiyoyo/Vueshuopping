import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入Vue插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
// 设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置 axios 拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 给Vue原型对象上设置新的对象方法axios方法
Vue.prototype.$http = axios
// 手动配置 element-ui
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable) // 注册全局可用的插件
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
