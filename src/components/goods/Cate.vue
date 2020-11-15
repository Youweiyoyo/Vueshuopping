<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!--Tab表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      ></tree-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类列表的所有数据
      catelist: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为Table指定列的含义
      columns: [
        {
          label: '分类名称',
          porp: 'cat_name'
        }
      ]
    }
  },
  created() {
    this.getCatelist()
  },
  methods: {
    // 获取商品分类数据
    async getCatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求数据失败')
      }
      // 把数据列表赋值给catelist
      console.log(res)
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped></style>
