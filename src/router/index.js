import Vue from 'vue';
import VueRouter from 'vue-router';
// 导入登录组件
import Login from '../components/login.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' }, // 重定向
    { path: '/login', component: Login }  // 定义路由规则
  ]

})
// 注册路由
export default router
