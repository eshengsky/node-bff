<template>
  <div class="params-edit">
    <div class="action-bar">
      <el-button icon="el-icon-plus" @click="addParam">
        添加参数
      </el-button>
    </div>
    <el-table
      :data="paramsList"
      border
      empty-text="没有参数"
    >
      <el-table-column
        prop="paramName"
        label="参数名"
        width="300"
      >
        <template slot-scope="{ row }">
          <el-autocomplete
            v-if="paramsAutocomplete.length"
            :ref="`paramsInput-${row.key}`"
            v-model="row.paramName"
            :fetch-suggestions="querySearch"
            placeholder="参数名"
          />
          <el-input
            v-else
            :ref="`paramsInput-${row.key}`"
            v-model="row.paramName"
            placeholder="参数名"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="必传"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-switch v-model="row.required" />
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="200"
      >
        <template slot-scope="{ row }">
          <el-input
            v-model="row.remark"
            placeholder="备注信息"
            :auto-size="{ minRows: 1, maxRows: 6 }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="180"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="() => {}">高级设置</el-button>
          <el-divider direction="vertical" />
          <el-popconfirm
            title="确定删除该参数吗？"
            @confirm="delParam(row)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { ICommonParam } from '~/types/index';
export default vue.extend({
  name: 'ParamsEdit',
  props: {
    paramsList: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<ICommonParam[]>,
    paramsAutocomplete: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<string[]>
  },
  computed: {
    autocompleteList () {
      if (!this.paramsAutocomplete.length) {
        return [];
      }
      return this.paramsAutocomplete.map((t) => {
        return {
          value: t
        };
      });
    }
  },
  methods: {
    addParam () {
      const key = Date.now();
      this.paramsList.push({
        key,
        paramName: '',
        required: false,
        remark: ''
      });

      // 自动聚焦末尾input
      this.$nextTick(() => {
        const el = this.$refs[`paramsInput-${key}`] as HTMLInputElement;
        if (el) {
          el.focus();
        }
      });
    },
    delParam (row: ICommonParam) {
      const index = this.paramsList.findIndex(t => row.key === t.key);
      if (index >= 0) {
        this.paramsList.splice(index, 1);
      }
    },
    querySearch (queryString: string, cb: Function) {
      const result = queryString ? this.autocompleteList.filter(t => t.value.toLowerCase().includes(queryString.toLowerCase())) : this.autocompleteList;
      cb(result);
    }
  }
});
</script>
<style lang="scss" scoped>
.action-bar {
  margin: 15px;
}
</style>
