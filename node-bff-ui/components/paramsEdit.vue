<template>
  <div class="params-edit">
    <div class="action-bar">
      <el-button icon="el-icon-plus" @click="addParam">
        添加参数
      </el-button>
    </div>
    <el-form ref="form" :model="formData" :rules="rules">
      <el-table
        :data="formData.paramsList"
        border
        size="medium"
        empty-text="没有参数"
      >
        <el-table-column
          prop="paramName"
          label="参数名"
          width="300"
        >
          <template slot-scope="{ row, $index }">
            <el-form-item :prop="'paramsList.'+ $index + '.paramName'" :rules="rules.paramName">
              <el-autocomplete
                v-if="paramsAutocomplete.length"
                :ref="`paramsInput-${row.key}`"
                v-model.trim="row.paramName"
                :fetch-suggestions="querySearch"
                placeholder="参数名，全部小写"
                style="width: 100%;"
              />
              <el-input
                v-else
                :ref="`paramsInput-${row.key}`"
                v-model.trim="row.paramName"
                placeholder="参数名"
              />
            </el-form-item>
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
          <div slot="header">
            备注<font-icon v-title="'备注将作为注释展示在代码的智能提示中'" class="icon" :icon="['far', 'question-circle']" style="margin-left: 3px;" />
          </div>
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
          width="180"
        >
          <template slot-scope="{ row }">
            <el-button type="text" @click="showAdvanced(row)">高级设置</el-button>
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
    </el-form>
    <advanced-dialog v-model="advancedShow" :param="currentParamObj" />
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { Form } from 'element-ui';
import { ICommonParam } from '~/types/index';
import { EnumBodyType } from '~/types/enum';
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
  data () {
    return {
      advancedShow: false,
      currentParamObj: {}
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
    },
    rules () {
      return {
        paramName: [
          { required: true, message: '参数名必填', trigger: 'change' },
          { required: true, message: '参数名必填', trigger: 'blur' },
          {
            validator: (_rule: any, value: string, callback: any) => {
              // 参数名称不能重复
              const filtered = this.paramsList.filter((param: ICommonParam) => {
                return param.paramName === value;
              });
              if (filtered?.length > 1) {
                callback(new Error('参数名不能重复'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      };
    },

    // 将参数列表包起来，为了将整个table放在form中，进而用表单校验功能
    formData () {
      return {
        paramsList: this.paramsList || []
      };
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
    /**
     * 自动添加content-type头
     * 如果选中了body参数类型为json或formData，且当前没有content-type头，则自动添加
     * 如果选中了body参数类型为none，且当前有content-type头，则自动删除
     * 其他情况不做变动
     */
    addContentType (bodyType: EnumBodyType) {
      const index = this.paramsList.findIndex(t => t.paramName === 'content-type');
      if (index < 0 && bodyType !== EnumBodyType.none) {
        this.paramsList.push({
          key: Date.now(),
          paramName: 'content-type',
          required: true,
          remark: ''
        });
        this.$message.warning('已自动添加content-type请求头');
      } else if (index >= 0 && bodyType === EnumBodyType.none) {
        this.paramsList.splice(index, 1);
        this.$message.warning('已自动移除content-type请求头');
      }
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
    },
    showAdvanced (paramObj: any) {
      this.advancedShow = true;
      this.currentParamObj = paramObj;
    },
    validate (): Promise<boolean> {
      return new Promise((resolve) => {
        const form = this.$refs.form as Form;
        form.validate((valid) => { resolve(valid); });
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.action-bar {
  margin: 15px;
}
</style>
