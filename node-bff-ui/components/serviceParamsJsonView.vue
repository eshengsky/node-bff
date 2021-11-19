<template>
  <div class="service-params-json-view">
    <el-table
      :data="paramsList"
      row-key="key"
      default-expand-all
      border
      size="medium"
      empty-text="没有参数"
    >
      <el-table-column
        prop="paramName"
        label="参数名"
        width="300"
      >
        <template slot-scope="{ row }">
          <template v-if="isInputDisabled(row)">
            <span class="field-muted">{{ row.paramName }}</span>
            <!-- root节点的提示 -->
            <font-icon v-if="row.parentKey === 0" v-title="'表示JSON的根节点'" class="icon field-muted" :icon="['far', 'question-circle']" />
            <!-- item节点的提示 -->
            <font-icon v-else v-title="'表示数组的元素'" class="icon field-muted" :icon="['far', 'question-circle']" />
          </template>
          <span v-else>{{ row.paramName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="100"
      >
        <template slot-scope="{ row }">
          {{ getTypeLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="paramValue"
        label="参数值"
      >
        <template slot-scope="{ row }">
          <template v-if="row.type === 'object'"></template>
          <template v-else>{{ row.paramValue }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import vue, { PropOptions } from 'vue';
import { IServiceParamJson } from '~/types/index';
export default vue.extend({
  name: 'serviceParamsJsonView',
  props: {
    paramsList: {
      type: Array,
      default () {
        const key = Date.now();
        return [{
          key,
          parentKey: 0,
          paramName: 'root',
          paramValue: '',
          type: 'object',
          children: [{
            key: Date.now() + 1,
            parentKey: key,
            paramName: '',
            paramValue: '',
            type: 'fixed',
            children: null
          }]
        }];
      }
    } as PropOptions<IServiceParamJson[]>
  },
  data () {
    return {
    };
  },
  methods: {
    getTypeLabel (type: string) {
      switch (type) {
        case 'fixed':
          return '固定值';
        case 'expression':
          return '表达式';
        case 'boolean':
          return '布尔值';
        case 'object':
          return '对象';
        case 'array':
          return '数组';
        default:
          break;
      }
    },
    getNodeByKey (key: number): IServiceParamJson | undefined {
      let result;
      const search = (arr: IServiceParamJson[]) => {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (item.key === key) {
            result = item;
            return;
          }
          if (item.children) {
            search(item.children);
          }
        }
      };
      search(this.paramsList);
      return result;
    },
    isInputDisabled (row: IServiceParamJson): boolean {
      if (row.parentKey === 0) {
        return true;
      }
      const paretNode = this.getNodeByKey(row.parentKey);
      if (paretNode && paretNode.type === 'array') {
        return true;
      }
      return false;
    }
  }
});
</script>
<style lang="scss" scoped>
.action-bar {
  margin: 0 15px 15px;
}
.field-muted {
  font-style: italic;
  opacity: .6;
  &.icon {
    position: relative;
    top: 1px;
  }
}
</style>
