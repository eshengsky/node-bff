<template>
  <div class="page-api-list">
    <div class="categories-wrap">
      <el-button type="primary" style="margin-left: 20px;" @click="redirectTo('/category-manage')">分类管理</el-button>
      <ul>
        <li :class="{ active: !params.category }" @click="changeCategory('')">全部分类</li>
        <li :class="{ active: params.category === 'default' }" @click="changeCategory('default')">默认分类</li>
        <li v-for="(item) in categories" :key="item._id" :class="{ active: params.category === item._id }" @click="changeCategory(item._id)">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="apis-wrap">
      <div class="action-bar">
        <el-button type="primary" @click="redirectTo('/api/new')">新的接口</el-button>
        <div>
          <el-input v-model="params.keyword" placeholder="接口名称、路径、描述等" clearable style="width: 400px;" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search" />
          </el-input>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="apiData.list"
        border
        class="table"
        :row-class-name="({ row }) => {
          return row.status !== EnumStatus.regular ? 'muted' : ''
        }"
        @sort-change="sortChange"
        @filter-change="filterChange"
      >
        <el-table-column prop="name" sortable="custom" label="接口名称" min-width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.category ? scope.row.category.name : '默认分类' }} / </span><span :class="{ muted: scope.row.status !== EnumStatus.regular }">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          column-key="method"
          label="接口方法"
          prop="method"
          width="120px"
          align="center"
          :filters="allMethods.length ? allMethods : null"
        >
          <template slot-scope="scope">
            <el-tag class="method-tag" :type="getMethodType(scope.row.method)">{{ scope.row.method.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" sortable="custom" label="接口路径" min-width="300">
          <template slot-scope="scope">
            <span :class="{ muted: scope.row.status !== EnumStatus.regular }">{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="version"
          label="当前版本"
          width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.version }}</span>
            <el-link v-title="'查看发布说明'" :underline="false"><font-icon :icon="['far', 'file-alt']" @click="showVersionNotes(scope.row)" /></el-link>
          </template>
        </el-table-column>
        <el-table-column
          column-key="status"
          label="接口状态"
          prop="status"
          width="100px"
          align="center"
          :filters="allStatus"
        >
          <template slot-scope="scope">
            <div class="status-field">
              <i v-if="scope.row.status === EnumStatus.deprecated" v-title="'已废弃'" class="icon-deprecated el-icon-remove" />
              <i v-else-if="scope.row.status === EnumStatus.deleted" v-title="'已删除'" class="icon-deleted el-icon-error" />
              <i v-else v-title="'正常'" class="icon-regular el-icon-success" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          column-key="createdBy"
          prop="createdBy"
          label="开发人员"
          width="200px"
          :filters="allCreators.length ? allCreators : null"
        />
        <el-table-column label="最近修改" prop="createdTime" sortable="custom" width="200px" align="center">
          <template slot-scope="scope">
            {{ scope.row.createdTime | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="420px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-link class="action-link" :underline="false" @click="redirectTo(`/api/${scope.row._id}`)">
              <font-icon :icon="['fas', 'eye']" />查看
            </el-link>
            <el-link class="action-link" :underline="false" @click="redirectTo(`/api/${scope.row._id}/edit`)">
              <font-icon :icon="['fas', 'pencil-alt']" />编辑
            </el-link>
            <el-link class="action-link" :underline="false" @click="showStatusModal(scope.row)">
              <i v-if="scope.row.status === EnumStatus.deleted" class="icon-deleted el-icon-error" />
              <i v-else-if="scope.row.status === EnumStatus.deprecated" class="icon-deprecated el-icon-remove" />
              <i v-else class="icon-regular el-icon-success" />
              状态更改
            </el-link>
            <el-link class="action-link" :underline="false" @click="showVersionModal(scope.row)">
              <font-icon :icon="['fas', 'history']" />版本管理
            </el-link>
            <el-link class="action-link" :underline="false" @click="redirectTo(`/online-test?thread=${scope.row.versionThread}`)">
              <font-icon :icon="['fas', 'flask']" />API测试
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :current-page="params.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="apiData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="修改接口状态"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div v-if="currentRow">
        <status-alert
          :type="EnumStatus.regular"
          pointer
          :checked="currentRow.status === EnumStatus.regular"
          style="margin-bottom: 15px;"
          @click.native="toggleStatus(EnumStatus.regular)"
        />
        <status-alert
          :type="EnumStatus.deprecated"
          pointer
          :checked="currentRow.status === EnumStatus.deprecated"
          style="margin-bottom: 15px;"
          @click.native="toggleStatus(EnumStatus.deprecated)"
        />
        <status-alert
          :type="EnumStatus.deleted"
          pointer
          :checked="currentRow.status === EnumStatus.deleted"
          @click.native="toggleStatus(EnumStatus.deleted)"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveStatus">确 定</el-button>
      </span>
    </el-dialog>
    <version-manage
      :id="currentRow ? currentRow.versionThread : ''"
      v-model="versionModalVisible"
      @updateCurrent="updateCurrent"
    />
    <version-notes v-model="versionNotesVisible" :message="currentRow ? currentRow.versionMessage : ''" />
  </div>
</template>

<script lang="ts">
import vue from 'vue';
import dayjs from 'dayjs';
import { EnumStatus } from '~/types/enum';
import { IApi } from '~/types';
export default vue.extend({
  name: 'ApiList',
  async asyncData ({ $axios }) {
    let allMethods = [];
    let allCreators = [];
    try {
      const [methods, creators] = await Promise.all([
        $axios.$get('/methods'),
        $axios.$get('/creators')
      ]);
      if (methods.data && methods.data.length) {
        allMethods = methods.data.map((t: string) => ({ text: t.toUpperCase(), value: t }));
      }
      if (creators.data && creators.data.length) {
        allCreators = creators.data.map((t: string) => ({ text: t, value: t }));
      }
    } catch (err) {
      console.error('接口请求异常！');
    }
    return {
      allMethods,
      allCreators
    };
  },
  data () {
    return {
      EnumStatus,
      apiData: {
        list: [],
        total: 0
      },
      allMethods: [],
      allCreators: [],
      allStatus: [{
        text: '正常',
        value: EnumStatus.regular
      }, {
        text: '已废弃',
        value: EnumStatus.deprecated
      }, {
        text: '已删除',
        value: EnumStatus.deleted
      }],
      categories: [],
      params: {
        page: 1,
        pageSize: 10,
        methods: '',
        creators: '',
        statuses: '',
        keyword: '',
        category: '',
        sortProp: 'createdTime',
        sortOrder: 'descending'
      },
      loading: false,
      currentRow: null as IApi | null,
      dialogVisible: false,
      versionModalVisible: false,
      versionNotesVisible: false
    };
  },
  mounted () {
    this.getCategories();
    this.getData();
  },
  methods: {
    async getData () {
      this.loading = true;
      try {
        const data = await this.$axios.$get('/apis', {
          params: this.params
        });
        this.apiData = data.data;
      } catch (err) {
        this.apiData = {
          list: [],
          total: 0
        };
        this.$message.error('接口请求异常！');
      }
      this.loading = false;
    },
    async getCategories () {
      try {
        const data = await this.$axios.$get('/categories');
        this.categories = data.data;
      } catch (err) {
        console.error('接口请求异常！');
      }
    },
    handleCurrentChange (val: number) {
      this.params.page = val;
      this.getData();
    },
    handleSizeChange (val: number) {
      this.params.pageSize = val;
      this.getData();
    },
    sortChange (sort: any) {
      if (sort.order) {
        // 如果存在显示的升降序，才视为要手动排序
        this.params.sortProp = sort.prop;
        this.params.sortOrder = sort.order;
      } else {
        // 否则走默认排序
        this.params.sortProp = 'createdTime';
        this.params.sortOrder = 'descending';
      }
      this.getData();
    },
    filterChange (filters: any) {
      if (filters.method) {
        this.params.methods = filters.method.join(',');
      }
      if (filters.createdBy) {
        this.params.creators = filters.createdBy.join(',');
      }
      if (filters.status) {
        this.params.statuses = filters.status.join(',');
      }
      this.getData();
    },
    changeCategory (category: string) {
      this.params.category = category;
      this.getData();
    },
    search () {
      this.getData();
    },
    getMethodType (method: string) {
      switch (method) {
        case 'get':
          return 'success';
        case 'post':
          return 'warning';
        case 'delete':
          return 'danger';
        case 'put':
          return '';
        default:
          return 'info';
      }
    },
    redirectTo (url: string) {
      this.$router.push(url);
    },
    showStatusModal (row: IApi) {
      this.currentRow = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    toggleStatus (status: EnumStatus) {
      if (this.currentRow) {
        this.currentRow.status = status;
      }
    },
    async saveStatus () {
      if (this.currentRow) {
        try {
          const data = await this.$axios.$put('/api/status', {
            _id: this.currentRow._id,
            status: this.currentRow.status
          });
          if (data.code === 1) {
            this.$message.success('接口状态更新成功！');
            this.getData();
          } else {
            this.$message.error('操作失败！');
          }
        } catch (err) {
          console.error(err);
          this.$message.error('操作失败！');
        }
        this.dialogVisible = false;
      }
    },
    showVersionModal (row: IApi) {
      this.currentRow = row;
      this.versionModalVisible = true;
    },
    updateCurrent () {
      this.getData();
    },
    showVersionNotes (row: IApi) {
      this.currentRow = row;
      this.versionNotesVisible = true;
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
.page-api-list {
  position: relative;
  .categories-wrap {
    width: 260px;
    height: calc(100vh - 60px);
    position: fixed;
    border-right: 1px solid #EBEEF5;
    padding: 20px 0;
    margin: -20px;
    overflow-y: auto;
    ul {
      margin-top: 10px;
      padding: 0;
      li {
        font-size: 14px;
        list-style: none;
        height: 50px;
        line-height: 50px;
        padding: 0 25px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
        &.active {
          background: #eee;
        }
      }
    }
  }
  .apis-wrap {
    padding-left: 260px;
    .action-bar {
      display: flex;
      justify-content: space-between;
    }
    .table {
      margin: 10px 0;
      .status-field {
        i {
          font-size: 22px;
          &.icon-regular {
            color: #67c23a;
          }
          &.icon-deprecated {
            color: #e6a23c;
          }
          &.icon-deleted {
            color: #f56c6c;
          }
        }
      }
      .method-tag {
        min-width: 60px;
        text-align: center;
        height: 28px;
        line-height: 28px;
        font-weight: 600;
      }
      .action-link {
        margin-right: 10px;
        font-weight: 400;
        svg {
          margin-right: 4px;
        }
        i {
          margin-right: 0;
          font-size: 15px;
        }
      }
      .muted {
        text-decoration: line-through;
      }
    }
    .pagination {
      text-align: right;
    }
  }
}
</style>
