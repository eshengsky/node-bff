<template>
  <div class="params-json-edit">
    <div v-if="!paramsList.length" class="action-bar">
      <el-button type="primary" icon="plus" @click="addRootNode">
        添加根节点
      </el-button>
    </div>
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
        width="400"
      >
        <template slot-scope="{ row, $index }">
          <template v-if="isInputDisabled(row)">
            <span class="field-muted">{{ row.paramName }}</span>
            <!-- root节点的提示 -->
            <font-icon v-if="row.parentKey === 0" v-title="'表示JSON的根节点'" class="icon field-muted" :icon="['far', 'question-circle']" />
            <!-- item节点的提示 -->
            <font-icon v-else v-title="'表示数组的元素'" class="icon field-muted" :icon="['far', 'question-circle']" />
          </template>
          <el-form v-else :ref="'form' + row.key" :model="row" :rules="rules" style="display: inline-block;">
            <el-form-item prop="paramName" :rules="rules.paramName">
              <el-input
                :ref="`paramsInput-${row.key}`"
                v-model.trim="row.paramName"
                placeholder="参数名"
                :style="{ width: 'auto' }"
              />
            </el-form-item>
          </el-form>
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
        prop="type"
        label="类型"
        width="150"
      >
        <template slot-scope="{ row }">
          <el-select v-model="row.type" @change="onTypeChange($event, row)">
            <el-option v-for="type in typeList" :key="type" :value="type" :label="type" />
          </el-select>
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
            placeholder="对该参数的额外说明"
            :auto-size="{ minRows: 1, maxRows: 6 }"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="250"
      >
        <template slot-scope="{ row }">
          <!-- 只有当前字段是object类型才显示添加子节点按钮 -->
          <template v-if="row.type === 'object'">
            <el-button type="text" @click="addChildNode(row)">添加子节点</el-button>
            <el-divider direction="vertical" />
          </template>
          <el-button type="text" @click="() => {}">高级设置</el-button>
          <!-- 删除按钮 -->
          <template v-if="isShowDelBtn(row)">
            <el-divider direction="vertical" />
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
import { IJsonParam } from '~/types/index';
export default vue.extend({
  name: 'ParamsJsonEdit',
  props: {
    paramsList: {
      type: Array,
      default () {
        return [];
      }
    } as PropOptions<IJsonParam[]>
  },
  data () {
    return {
      typeList: [
        'string',
        'number',
        'boolean',
        'object',
        'array'
      ]
    };
  },
  computed: {
    rules () {
      return {
        paramName: [
          { required: true, message: '参数名必填', trigger: 'blur' },
          {
            validator: (_rule: any, value: string, callback: any) => {
              // 参数名称不能重复,遍历参数树，如果有不止一个和‘value’重名的，则说明是重复
              let count = 0;
              this.walkTree(this.paramsList[0], (node: any) => {
                if (node.paramName === value) {
                  count++;
                }
              });
              if (count > 1) {
                callback(new Error('参数名不能重复'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      };
    }
  },
  methods: {
    addRootNode () {
      this.paramsList.push({
        key: Date.now(),
        parentKey: 0,
        paramName: 'root',
        required: false,
        type: 'string',
        children: null
      });
    },
    addChildNode (row: IJsonParam) {
      row.children = row.children || [];
      const key = Date.now();
      row.children.push({
        key,
        parentKey: row.key,
        paramName: '',
        type: 'string',
        required: false,
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
    delParam (row: IJsonParam) {
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
    onTypeChange (value: string, row: IJsonParam) {
      switch (value) {
        case 'object':
          row.children = [{
            key: Date.now(),
            parentKey: row.key,
            paramName: '',
            required: false,
            type: 'string',
            children: null
          }];
          break;
        case 'array':
          row.children = [{
            key: Date.now(),
            parentKey: row.key,
            paramName: 'item',
            required: false,
            type: 'string',
            children: null
          }];
          break;
        default:
          row.children = null;
          break;
      }
    },
    getNodeByKey (key: number): IJsonParam | undefined {
      let result;
      const search = (arr: IJsonParam[]) => {
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
    isShowDelBtn (row: IJsonParam): boolean {
      if (row.parentKey === 0) {
        // 根节点允许删除
        return true;
      }
      const parentNode = this.getNodeByKey(row.parentKey);
      if (parentNode && parentNode.type === 'object') {
        // 父节点是对象，允许删除
        return true;
      }
      return false;
    },
    isInputDisabled (row: IJsonParam): boolean {
      if (row.parentKey === 0) {
        return true;
      }
      const paretNode = this.getNodeByKey(row.parentKey);
      if (paretNode && paretNode.type === 'array') {
        return true;
      }
      return false;
    },
    walkTree (node: any, fn: Function) {
      if (node) {
        fn(node);
        if (node.children) {
          for (const child of node.children) {
            this.walkTree(child, fn);
          }
        }
      }
    },
    validateAForm (form: any): Promise<boolean> {
      return new Promise((resolve) => {
        // const form = this.$refs.form as Form;
        form.validate((valid: boolean | PromiseLike<boolean>) => { resolve(valid); });
      });
    },
    /** 可能存在多个el-form，所以需要通过遍历参数树，获取所有el-form，然后逐一验证form表单，只要有一个没验证通过，则判定不通过 */
    async validate (): Promise<boolean> {
      if (this.paramsList.length === 0) {
        return true;
      }
      const formRefArr: any[] = [];
      this.walkTree(this.paramsList[0], (node: any) => {
        const formRef = this.$refs[`form${node.key}`];
        if (formRef) {
          formRefArr.push(formRef);
        }
      });
      for (const item of formRefArr) {
        const result = await this.validateAForm(item);
        if (!result) {
          return false;
        }
      }
      return true;
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
