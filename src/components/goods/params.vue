<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="scaledCateKeys"
            :options="cateDataList"
            @change="handleChange"
            :props="cateProps"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTabteData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
              <template>
                <el-button type="primary" icon="el-icon-edit " size="mini"
                  >编辑按钮</el-button
                >
                <el-button type="warning" icon="el-icon-delete" size="mini"
                  >删除按钮</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="onlyTabteData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
              <template>
                <el-button type="primary" icon="el-icon-edit " size="mini"
                  >编辑按钮</el-button
                >
                <el-button type="warning" icon="el-icon-delete" size="mini"
                  >删除按钮</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- Dialog 对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取到的所有的数据列表信息
      cateDataList: [],
      // 级联选择框的数据对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //  级联选择框双向数据绑定
      scaledCateKeys: [],
      // 标签页显示的第一个名称
      activeName: 'many',
      // 动态参数列表数据
      manyTabteData: [],
      //  静态属性的数据
      onlyTabteData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据列表失败')
      }
      this.cateDataList = res.data
    },
    // 级联选择框中选项变化，会触发的函数
    handleChange() {
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取商品列表数据
    async getParamsData() {
      //  整明选中的不是三级分类
      if (this.scaledCateKeys.length !== 3) {
        this.scaledCateKeys = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表参数失败')
      }
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabteData = res.data
      } else {
        this.onlyTabteData = res.data
      }
    }
  },

  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.scaledCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.scaledCateKeys.length === 3) {
        return this.scaledCateKeys[2]
      }
      return null
    },
    // 动态控制显示哪一个对话框
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
</style>
