<template>
  <div class="global-search">
    <el-dialog
      :show-close="false"
      :visible="value"
      width="50%"
      @opened="onOpend"
      @close="close"
    >
      <div class="dialog-body">
        <div class="input-wrap">
          <i class="icon-search el-icon-search" />
          <input ref="input" v-model="keyword" placeholder="接口名称、路径、描述等" @input="search">
          <i class="icon-close el-icon-close" @click="close" />
        </div>
        <div class="result-wrap">
          <ul v-if="result.list.length">
            <li v-for="item in result.list" :key="item.id" @click="selectItem(item)">
              <div class="name-wrap">
                <span>{{ item.category ? item.category.name : '默认分类' }} / </span><span :class="{ muted: item.status !== EnumStatus.regular }">{{ item.name }}</span>
              </div>
              <div class="path-wrap">
                <el-tag class="method-tag" :type="getMethodType(item.method)">{{ item.method.toUpperCase() }}</el-tag><span class="path">{{ item.path }}</span>
              </div>
            </li>
          </ul>
          <div v-else-if="!loading" class="pending-block">没有结果</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { EnumStatus } from '~/types/enum';
export default vue.extend({
  name: 'GlobalSearch',
  props: {
    value: {
      type: Boolean,
      default: false
    } as PropOptions<boolean>
  },
  data () {
    return {
      EnumStatus,
      keyword: '',
      loading: false,
      result: {
        list: [],
        total: 0
      }
    };
  },
  methods: {
    close () {
      this.$emit('input', false);
    },
    onOpend () {
      (this.$refs.input as HTMLInputElement).focus();
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
    async search () {
      this.loading = true;
      const params: any = {};
      if (this.keyword) {
        // 如果输入了关键字了，则取前100条搜索结果
        params.keyword = this.keyword;
        params.pageSize = 100;
      } else {
        // 没有关键字，则取最近修改过的10条数据展示
        params.pageSize = 10;
      }
      try {
        const data = await this.$axios.$get('/apis', {
          params
        });
        this.result = data.data;
      } catch (err) {
        this.result = {
          list: [],
          total: 0
        };
        this.$message.error('接口请求异常！');
      }
      this.loading = false;
    },
    selectItem (item: any) {
      this.$emit('select-item', item);
      this.close();
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.search();
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.dialog-body {
  .input-wrap {
    display: flex;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid #eee;
    padding: 0 30px;
    i {
      flex: none;
    }
    input {
      flex: 1;
      font-size: 17px;
      color: #555;
      padding: 0 10px;
      border: 0;
      outline: none;
    }
    .icon-search {
      font-size: 20px;
      position: relative;
      top: -1px;
    }
    .icon-close {
      font-size: 20px;
      font-weight: bold;
      color: #999;
      cursor: pointer;
      &:hover {
        color: #666;
      }
    }
  }
  .result-wrap {
    max-height: calc(70vh - 80px);
    min-height: 100px;
    overflow-y: auto;
    .pending-block {
      display: flex;
      height: 100px;
      justify-content: center;
      align-items: center;
      color: #999;
      user-select: none;
    }
    ul {
      margin: 0;
      padding: 0;
      li {
        list-style: none;
        padding: 12px 25px;
        cursor: pointer;
        background: #fff;
        transition: background .2s linear;
        &:hover {
          color: #fff;
          background: #409EFF;
        }
        .name-wrap {
          font-size: 13px;
          margin-bottom: 5px;
        }
        .path-wrap {
          .method-tag {
            min-width: 60px;
            text-align: center;
            height: 26px;
            line-height: 26px;
            font-weight: 600;
            margin-right: 6px;
          }
          .path {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.global-search {
  .el-dialog {
    border-radius: 8px;
    overflow: hidden;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
