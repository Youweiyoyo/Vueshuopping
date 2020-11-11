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
  aside
} from 'element-ui'
// 导入弹出框组件
Vue.use(Button)
Vue.use(From)
Vue.use(FromItem)
Vue.use(Input)
Vue.use(header)
Vue.use(container)
Vue.use(main)
Vue.use(aside)
Vue.prototype.$message = Message
