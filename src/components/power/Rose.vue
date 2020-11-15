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
                :class="['bootmborder', 'vcenter', i1 === 0 ? 'dbborder' : '']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag>
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限和三级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in scope.row.children"
                    :key="item2.id"
                    :class="[i2 === 0 ? '' : 'dbborder', 'vcenter']"
                  >
                    <!-- 通过for循环嵌套渲染二级权限 -->
                    <el-col :span="6">
                      <el-tag type="success">
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="RemoveRightById(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="⭐"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="340px">
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <!-- 用户操作按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="authoritydistribution(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 分配权限管理的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="authoritydialogVisible"
      width="50%"
      @close="clearDefkeys()"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="resiList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authoritydialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="treeSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 定义角色用户表格
      RoseList: [],
      // 控制分配权限对话框的展示
      authoritydialogVisible: false,
      // 所有权限的数据
      resiList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //  角色下所有三级权限的id
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
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
    },
    // 根据Id删除对应的权限
    async RemoveRightById(role, id) {
      // close触发弹出框
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除操作')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户的权限失败')
      }
      role.children = res.data
    },
    // 分配权限的处理函数
    async authoritydistribution(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
      }
      // 获取到的权限数据保存在resiList中
      this.resiList = res.data
      // 递归调用获取三级节点的所有权限
      this.getLeafkeys(role, this.defkeys)
      this.authoritydialogVisible = true
      console.log(this.resiList)
    },
    //  // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafkeys(node, arr) {
      if (!node.children) {
        // 如果当前node节点不包含children属性，则是三级节点
        return arr.push(node.id)
      }
      // 遍历node.children
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // close关闭Tag标签时触发
    // 监听分配权限列表的close事件，触发事件，清除数组
    clearDefkeys() {
      this.defkeys = []
    },
    // 点击确定提交选择的用户权限
    async treeSub() {
      const keys = [
        // 获取到所有已经选中的分配权限的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const strId = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: strId }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配用户权限成功！')
      this.getRoseList()
      this.authoritydialogVisible = false
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
.vcenter {
  display: flex;
  align-items: center;
}
</style>
