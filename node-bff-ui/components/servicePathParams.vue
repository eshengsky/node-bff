<template>
  <div class="service-path-params">
    <el-table
      :data="paramsList"
      border
      size="medium"
      empty-text="没有检测到路径参数"
    >
      <el-table-column
        prop="paramName"
        label="参数名"
        width="200"
      >
        <template slot-scope="{ row }">
          <span>{{ row.paramName }}</span>
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
    path: {
      type: String,
      default: ''
    } as PropOptions<String>,
    paramsList: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<IServiceParam[]>
  },
  data () {
    return {
      dialogVisible: false
    };
  },
  computed: {
    hasPathParams () {
      return this.path.match(/:\w+/g);
    }
  },
  watch: {
    path (val: string) {
      if (val) {
        const matched = val.match(/:\w+/g);
        if (matched && matched.length) {
          const arr = [] as IServiceParam[];
          matched.forEach((t) => {
            const paramName = t.substring(1);
            if (!arr.find(m => m.paramName === paramName)) {
              arr.push({
                key: paramName,
                paramName,
                paramValue: '',
                valType: 'fixed'
              });
            }
          });
          if (this.paramsList.length) {
            this.paramsList.forEach((param) => {
              const found = arr.find(t => t.paramName === param.paramName);
              if (found) {
                found.paramValue = param.paramValue;
              }
            });
          }
          this.paramsList.splice(0, this.paramsList.length, ...arr);
        } else {
          this.paramsList.splice(0, this.paramsList.length);
        }
      } else {
        this.paramsList.splice(0, this.paramsList.length);
      }
    }
  }
});
</script>
