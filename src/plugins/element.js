import Vue from 'vue'
import {
  From,
  FromItem,
  Input,
  Button,
  Message,
  header,
  container,
  main,
  aside,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  card,
  row,
  col
} from 'element-ui'
// 导入弹出框组件
Vue.use(Button)
Vue.use(From)
Vue.use(FromItem)
Vue.use(Input)
Vue.use(header)
Vue.use(container)
Vue.use(main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(card)
Vue.use(row)
Vue.use(col)
Vue.prototype.$message = Message
