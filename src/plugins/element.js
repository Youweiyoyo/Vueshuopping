import Vue from 'vue'
import {
  From,
  FromItem,
  Input,
  Button,
  Message
} from 'element-ui'
// 导入弹出框组件
Vue.use(Button)
Vue.use(From)
Vue.use(FromItem)
Vue.use(Input)
Vue.prototype.$message = Message
