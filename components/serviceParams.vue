<template>
  <div class="service-params">
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
        width="200"
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
        prop="paramValue"
        label="参数值"
      >
        <template slot-scope="{ row }">
          <el-input
            v-model="row.paramValue"
            placeholder="参数值"
            :auto-size="{ minRows: 1, maxRows: 6 }"
          >
            <el-select slot="prepend" v-model="row.valType" style="width: 95px;">
              <el-option key="fixed" value="fixed" label="固定值" />
              <el-option key="expression" value="expression" label="表达式" />
            </el-select>
            <el-button v-if="row.valType === 'expression'" slot="append" icon="el-icon-key" @click="showTreeModal(row)" />
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-popconfirm
            title="确定删除该参数吗？"
            @confirm="delParam(row)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <tree-modal v-model="dialogVisible" />
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import TreeModal from './treeModal.vue';
import { IServiceParam } from '~/types/index';
export default vue.extend({
  name: 'ServiceParams',
  components: {
    TreeModal
  },
  props: {
    paramsList: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<IServiceParam[]>,
    paramsAutocomplete: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<string[]>
  },
  data () {
    return {
      dialogVisible: false
    };
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
        paramValue: '',
        valType: 'fixed'
      });

      // 自动聚焦末尾input
      this.$nextTick(() => {
        const el = this.$refs[`paramsInput-${key}`] as HTMLInputElement;
        if (el) {
          el.focus();
        }
      });
    },
    delParam (row: IServiceParam) {
      const index = this.paramsList.findIndex(t => row.key === t.key);
      if (index >= 0) {
        this.paramsList.splice(index, 1);
      }
    },
    querySearch (queryString: string, cb: Function) {
      const result = queryString ? this.autocompleteList.filter(t => t.value.toLowerCase().includes(queryString.toLowerCase())) : this.autocompleteList;
      cb(result);
    },
    showTreeModal () {
      this.dialogVisible = true;
    }
  }
});
</script>
<style lang="scss" scoped>
.action-bar {
  margin: 15px;
}
</style>
