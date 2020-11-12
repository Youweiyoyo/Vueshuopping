import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../components/login.vue'
// 导入主页组件
import Home from '../components/home.vue'
// 定义欢迎路由
import Welcom from '../components/Welcome.vue'
// 定义用户路由
import user from '../components/User/Users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' }, // 重定向
    { path: '/login', component: Login }, // 定义路由规则
    {
      path: '/home',
      component: Home,
      redirect: '/Welcome',
      children: [
        { path: '/Welcome', component: Welcom }, // 定义欢迎路由]}
        { path: '/users', component: user }
      ]
    }
  ]
})
// 注册路由
export default router
// 条件路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的
  // from 代表从哪个路径跳转而来
  // next 代表放行
  // next()放行  next('/login')带值数指定跳转到某个页面
  // 访问登录页面直接放行
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
