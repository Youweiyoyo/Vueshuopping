<template>
  <el-container class="homeContainer">
    <!-- 头部区域 -->
    <el-header>
      Header
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 右侧内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.homeContainer{
  width: 100%;
  height: 100%;
}
</style>
