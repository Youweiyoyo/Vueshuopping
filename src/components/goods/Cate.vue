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
          <el-button type="primary" @click="addDialogShow">添加分类</el-button>
        </el-col>
      </el-row>
      <!--Tab表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加按钮对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialog"
      width="50%"
      @close="addcateDialogClose"
    >
      <el-form
        :model="addCataForm"
        :rules="cataRules"
        ref="cataRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCataForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="catemodel"
            :options="parentCateList"
            :props="cascaderProps"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogFrom">确 定</el-button>
      </span>
    </el-dialog>
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
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板的名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 控制添加用户对话框的显示与隐藏
      addDialog: false,
      // 添加分类表单的数据对象
      addCataForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类的层级，默认添加一级分类
        cat_level: 0
      },
      // 表单的验证规则对象
      cataRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 获取到的父级分类所有数据列表
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id', // 具体选中的某个值的属性
        label: 'cat_name', // 看到的某个属性
        children: 'children' // 父子嵌套用的某个属性
      },
      // 选中的父级分类的id数组
      catemodel: []
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
    },
    // 监听分页的change事件
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getCatelist()
    },
    // 监听页码的change事件
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCatelist()
    },
    // 控制添加用户对话框弹出的处理函数
    addDialogShow() {
      // 获取父级分类数据列表
      this.getParentCateList()
      //  展示对话框
      this.addDialog = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 级联选择器发生变化后的事件
    cateChange() {
      // 如果catemodel数组中的lenght大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.catemodel.length > 0) {
        // 父级分类的id
        this.addCataForm.cat_pid = this.catemodel[this.catemodel.length - 1]
        // 为当前分类的等级赋值
        this.addCataForm.cat_level = this.catemodel.length
        return false
      } else {
        // 父级分类的id
        this.addCataForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCataForm.cat_level = 0
      }
    },
    // 监听对话框的关闭事件，清空表单数据
    addcateDialogClose() {
      this.$refs.cataRef.resetFields()
      this.catemodel = []
      this.addCataForm.cat_pid = 0
      this.addCataForm.cat_level = 0
    },
    // 点击确定提交表单事件
    addCateDialogFrom() {
      this.$refs.cataRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCataForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCatelist()
        this.addDialog = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
