<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isunfold ? '64px' : '200px'">
        <div class="togolle-button" @click="unfoldButton">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#2a85f6"
          :unique-opened="true"
          :collapse="isunfold"
          :collapse-transition="false"
          router
          :default-active="activepath"
        >
          <!-- 外层导航栏一 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="seaveNav('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      //  定义字体对象
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-users',
        101: 'iconfont icon-tijikongjian',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-shangpin '
      },
      // 是否折叠
      isunfold: false,
      // 被激活的链接地址
      activepath: ''
    }
  },
  // 定义生命周期函数
  created() {
    this.getMenuList() // 调getMenuList来获取所有的左侧菜单
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    // 点击按钮切换菜单的折叠与展开
    unfoldButton() {
      this.isunfold = !this.isunfold
    },
    // 保存链接的激活状态
    seaveNav(activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activepath = activepath
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
      console.log(res)
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.homeContainer {
  width: 100%;
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.togolle-button {
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  background-color: #ff6600;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
