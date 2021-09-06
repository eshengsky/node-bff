<template>
  <div class="page-category-list">
    <el-button type="primary" @click="showDialog = true">新的分类</el-button>
    <el-table
      v-loading="loading"
      :data="list"
      border
      class="table"
    >
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="description" label="分类描述" />
      <el-table-column prop="modifiedBy" label="修改人" width="250px" />
      <el-table-column label="修改时间" width="250px">
        <template slot-scope="scope">
          {{ scope.row.modifiedTime | formatTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template slot-scope="scope">
          <el-link class="action-link" icon="el-icon-edit" :underline="false" @click="edit(scope.row)">编辑</el-link>
          <el-link class="action-link" icon="el-icon-first-aid-kit" :underline="false" @click="del(scope.row._id)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="showDialog"
      :destroy-on-close="true"
      :title="`${form._id ? '编辑' : '新增'}分类`"
      width="600px"
      @closed="onClosedDialog"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item prop="name" label="分类名称" label-width="100px">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类描述" label-width="100px">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import vue from 'vue';
import dayjs from 'dayjs';
import { ICategory } from '~/types/index';
export default vue.extend({
  name: 'CategoryList',
  data () {
    return {
      list: [],
      loading: false,
      showDialog: false,
      form: {
        name: '',
        description: ''
      } as ICategory,
      rules: {
        name: [{
          required: true, message: '请输入分类名称', trigger: 'blur'
        }]
      }
    };
  },
  mounted () {
    this.getList();
  },
  methods: {
    async getList () {
      this.loading = true;
      try {
        const data = await this.$axios.$get('/categories');
        this.list = data.data;
      } catch (err) {
        this.list = [];
        this.$message.error('接口请求异常！');
      }
      this.loading = false;
    },
    onClosedDialog () {
      this.form = {
        name: '',
        description: ''
      } as ICategory;
    },
    edit (row: ICategory) {
      this.form = JSON.parse(JSON.stringify(row));
      this.showDialog = true;
    },
    del (id: string) {
      console.log(id);
    },
    save () {
      (this.$refs.ruleForm as any).validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true;
          try {
            await this.$axios.$post('/category', {
              ...this.form,
              modifiedBy: (this.$store.$auth.user as any).name
            } as ICategory);
          } catch (err) {
            this.$message.error('接口请求异常！');
          }
          this.loading = false;
          this.showDialog = false;
          this.getList();
        }
      });
    }
  },
  filters: {
    formatTime (time: string) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
  }
});
</script>

<style lang="scss" scoped>
.table {
  margin: 10px 0;
}
.method-tag {
  min-width: 60px;
  text-align: center;
  height: 28px;
  line-height: 28px;
}
.action-link {
  margin-right: 10px;
}
</style>
<style lang="scss">
.page-category-list {
  .action-link i {
    position: relative;
    top: 1px;
  }
}
</style>
