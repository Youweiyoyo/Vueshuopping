<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginFrom"
        :rules="loginFromRules"
        ref="loginFromRef"
      >
        <!-- 用户名框 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码框-->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-lock_fill"
            v-model="loginFrom.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" round @click="yzFrom">登录</el-button>
          <el-button type="info" round @click="restLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginFrom: {
        username: '',
        password: ''
      },
      loginFromRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    restLoginFrom() {
      // console.log(this);
      this.$refs.loginFromRef.resetFields()
    },
    // 确定按钮
    yzFrom() {
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.post('login', this.loginFrom)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('用户名或密码错误，登录失败')
        }
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 将获取到的token存放在sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 登录成功后跳转主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
