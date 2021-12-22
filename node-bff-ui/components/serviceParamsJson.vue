<template>
  <div class="service-params-json-edit">
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
          <el-input
            v-else
            :ref="`paramsInput-${row.key}`"
            v-model="row.paramName"
            placeholder="参数名"
            :style="{ width: '120px' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="120"
      >
        <template slot-scope="{ row }">
          <el-select v-model="row.type" @change="onTypeChange($event, row)">
            <el-option key="fixed" value="fixed" label="固定值" />
            <el-option key="expression" value="expression" label="表达式" />
            <el-option key="boolean" value="boolean" label="布尔值" />
            <el-option key="object" value="object" label="对象" />
            <el-option key="array" value="array" label="数组" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="paramValue"
        label="参数值"
        width="300"
      >
        <template slot-scope="{ row }">
          <template v-if="row.type === 'object' || row.type === 'array'"></template>
          <el-select v-else-if="row.type === 'boolean'" v-model="row.paramValue" :style="{ width: '100%' }">
            <el-option :key="true" :value="true" label="true" />
            <el-option :key="false" :value="false" label="false" />
          </el-select>
          <el-input
            v-else
            :ref="`paramsInput-${row.key}`"
            v-model="row.paramValue"
            :placeholder="row.type === 'expression' ? '例：context.$request.query.xxx' : '请输入'"
            :style="{ width: '100%' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
      >
        <template slot-scope="{ row }">
          <!-- 只有当前字段是object类型才显示添加子节点按钮 -->
          <template v-if="row.type === 'object' || row.type === 'array'">
            <el-button type="text" @click="addChildNode(row)">添加子节点</el-button>
            <el-divider direction="vertical" v-if="isShowDelBtn(row)" />
          </template>
          <!-- 删除按钮 -->
          <template v-if="isShowDelBtn(row)">
            <el-popconfirm
              title="确定删除该参数吗？"
              @confirm="delParam(row)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import vue, { PropOptions } from 'vue';
import { IServiceParamJson } from '~/types/index';
export default vue.extend({
  name: 'serviceParamsJson',
  props: {
    paramsList: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<IServiceParamJson[]>
  },
  data () {
    return {
    };
  },
  mounted () {
    if (!this.paramsList || this.paramsList.length === 0) {
      this.addRootNode();
    }
  },
  methods: {
    addRootNode () {
      const key = Date.now();
      this.paramsList.push({
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
      });
    },
    addChildNode (row: IServiceParamJson) {
      row.children = row.children || [];
      const key = Date.now();
      row.children.push({
        key,
        parentKey: row.key,
        paramName: row.type === 'array' ? 'item' : '',
        paramValue: '',
        type: 'fixed',
        children: null
      });

      // 自动聚焦末尾input
      this.$nextTick(() => {
        const el = this.$refs[`paramsInput-${key}`] as HTMLInputElement;
        if (el) {
          el.focus();
        }
      });
    },
    delParam (row: IServiceParamJson) {
      // 删除根节点
      if (row.parentKey === 0) {
        this.paramsList.splice(0, 1);
        return;
      }

      // 删除普通对象的子节点
      const parentNode = this.getNodeByKey(row.parentKey);
      if (parentNode && parentNode.children) {
        const index = parentNode.children.findIndex(t => t.key === row.key);
        if (index >= 0) {
          parentNode.children.splice(index, 1);
        }
      }
    },
    onTypeChange (value: string, row: IServiceParamJson) {
      switch (value) {
        case 'object':
          row.children = [{
            key: Date.now(),
            parentKey: row.key,
            paramName: '',
            paramValue: '',
            type: 'fixed',
            children: null
          }];
          break;
        case 'array':
          row.children = [{
            key: Date.now(),
            parentKey: row.key,
            paramName: 'item',
            paramValue: '',
            type: 'fixed',
            children: null
          }];
          break;
        default:
          row.children = null;
          break;
      }
      if (value === 'boolean') {
        row.paramValue = '';
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
    isShowDelBtn (row: IServiceParamJson): boolean {
      if (row.parentKey === 0) {
        // 根节点允许删除
        return true;
      }
      const parentNode = this.getNodeByKey(row.parentKey);
      if (parentNode && (parentNode.type === 'object' || parentNode.type === 'array')) {
        // 父节点是对象或数组，允许删除
        return true;
      }
      return false;
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
