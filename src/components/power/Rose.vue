<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="RoseList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
                :class="['bootmborder', i1 === 0 ? 'dbborder' : '']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag>
                    {{ item1.authName }}
                  </el-tag>
                </el-col>
                <!-- 二级权限和三级权限 -->
                <el-col :span="19">
                  {{ item1.children.authName }}
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="⭐"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="340px">
            <template>
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <!-- 用户操作按钮 -->
              <el-button type="warning" icon="el-icon-setting"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 定义角色用户表格
      RoseList: []
    }
  },
  // 生命周期函数
  created() {
    // 获取请求渲染页面
    this.getRoseList()
  },
  methods: {
    async getRoseList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('请求角色权限列表失败')
      }
      this.RoseList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.dbborder {
  border-top: 1px solid #ccc;
}
.bootmborder {
  border-bottom: 1px solid #ccc;
}
</style>
