<template>
  <el-table :data="paramsList" border size="medium">
    <el-table-column prop="paramName" label="参数名" width="300" />
    <el-table-column prop="valType" label="参数类型" width="100">
      <template slot-scope="{ row }">
        {{ row.valType === 'expression' ? '表达式' : '固定值' }}
      </template>
    </el-table-column>
    <el-table-column prop="paramValue" label="参数值" />
  </el-table>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { IServiceParam } from '~/types';
export default vue.extend({
  name: 'ServiceParamsView',
  props: {
    paramsList: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<IServiceParam[]>
  }
});
</script>
