<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- :gutter="50"指定列与列之间的间隙 搜索与添加区域-->
      <el-row :gutter="50">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @change="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表表格区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_id"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              inactive-color="#CCCCCC"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
            <!-- 修改用户信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              sieze="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户信息 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              sieze="mini"
              @click="removeUserDeleteId(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <!-- 编辑用户按钮 -->
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                sieze="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFromClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="EditDialogClosed"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="100px"
      >
        <el-form-item label="用户名称">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialog"
      width="50%"
      @close="setRoleDialogclosed"
    >
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in RolseList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的校验规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入正确的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加验证表单的验证规则对象
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户信息的对话框的显示与否
      editDialogVisible: false,
      // 查询到的用户信息对象
      editFrom: {},
      // 定义修改用户信息的对话框的正则对象
      editFromRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色的对话框的显示隐藏
      setRoleDialog: false,
      // 需要被分配权限的用户角色信息
      userInfo: {},
      // 所有的用户数据
      RolseList: [],
      // 双向数据绑定的值
      selectedRoleId: ''
    }
  },
  // 生命周期函数
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关的状态
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功')
    },
    // 简单用户对话框的关闭事件
    addFromClose() {
      this.$refs.addRuleForm.resetFields()
    },
    addUser() {
      this.$refs.addRuleForm.validate(async valid => {
        if (!valid) return
        // 发起网络请求
        const { data: res } = await this.$http.post('users', this.addFrom)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户的列表
        this.getUserList()
      })
    },
    // 修改用户信息按钮
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editFrom = res.data
    },
    // 监听修改用户表单的重置
    EditDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    // 修改用户的表单提交和预验证和修改用户的数据
    editUser() {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写正确的用户信息')
        }
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editFrom.id,
          { email: this.editFrom.email, mobile: this.editFrom.mobile }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        // 关闭对话框窗口
        this.editDialogVisible = false
        // 重新渲染列表
        this.getUserList()
        // 修改成功提示弹窗
        this.$message.success('修改成功')
      })
    },
    // 根据Id删除用户数据
    async removeUserDeleteId(id) {
      console.log(id)
      // 先弹框提示，是否删除数据
      const confirmResf = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(res => res)
      console.log(confirmResf)
      if (confirmResf !== 'confirm') {
        return this.$message.info('操作已经取消')
      }
      // 发起请求删除id对应的用户信息
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      // 删除成功弹窗
      this.$message.success('删除成功')
      // 重新渲染页面
      this.getUserList()
    },
    // 展示分配角色的点击函数
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表数据失败')
      }
      // 将获取到的数据保存下来
      this.RolseList = res.data
      this.setRoleDialog = true
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色信息失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialog = false
    },
    // close事件
    setRoleDialogclosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style scoped></style>
