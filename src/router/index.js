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
// 定义用户权限的路由
import Rights from '../components/power/Rights.vue'
// 定义角色列表的路由
import rose from '../components/power/Rose.vue'
// 定义商品分类的组件
import cate from '../components/goods/Cate.vue'
// 定义分类参数组件
import params from '../components/goods/params.vue'
// 定义商品组件
import goods from '../components/goods/goods.vue'
// 商品列表定义添加商品组件
import goodsAdd from '../components/goods/goodsAdd.vue'
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
        { path: '/Welcome', component: Welcom }, // 定义欢迎路由
        { path: '/users', component: user },
        { path: '/rights', component: Rights }, // 定义用户权限的路由
        { path: '/roles', component: rose }, // 定义用户角色的路由
        { path: '/categories', component: cate }, // 定义商品分类组件
        { path: '/params', component: params }, // 定义分类参数组件
        { path: '/goods', component: goods }, // 定义商品主页组件
        { path: '/goods/add', component: goodsAdd } // 定义商品列表添加商品组件
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
