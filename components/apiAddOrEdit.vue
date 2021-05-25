<template>
  <div class="container">
    <el-form ref="form" :model="apiData" :rules="rules" label-width="100px">
      <h4>基本信息</h4>
      <div>
        <el-form-item label="接口状态">
          <el-radio-group v-model="apiData.status" size="medium">
            <el-radio-button :label="EnumStatus.regular">
              正常
            </el-radio-button>
            <el-radio-button :label="EnumStatus.maintaining">
              维护中
            </el-radio-button>
            <el-radio-button :label="EnumStatus.deprecated">
              已废弃
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="接口名称"
          prop="name"
        >
          <el-input
            v-model="apiData.name"
            style="width: 50%;"
            placeholder="请输入接口名称"
          >
            <el-select slot="prepend" v-model="apiData.category" style="min-width: 120px;">
              <el-option key="" value="" label="默认分类" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="path"
          label="接口路径"
        >
          <el-input
            v-model="apiData.path"
            placeholder="必须以 / 开头"
            style="width: 50%"
          >
            <http-method-list slot="prepend" v-model="apiData.method" />
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="apiData.description"
            placeholder="请输入接口备注"
          />
        </el-form-item>
      </div>
      <h4>参数定义</h4>
      <div>
        <el-tabs v-model="currentParamTab" type="border-card">
          <el-tab-pane name="url" class="tab-panel">
            <tab-header slot="label" :type="EnumParamType.url" :num="apiData.urlParams.length" />
            <params-edit :params-list="apiData.urlParams" />
          </el-tab-pane>
          <el-tab-pane name="body" class="tab-panel">
            <tab-header slot="label" :type="EnumParamType.body" :num="apiData.bodyType === EnumBodyType.none ? 0 : (apiData.bodyType === EnumBodyType.json ? -1 : apiData.formParams.length)" />
            <el-radio-group v-model="apiData.bodyType" class="switch-body">
              <el-radio :label="EnumBodyType.none">
                无需参数
              </el-radio>
              <el-radio :label="EnumBodyType.json">
                JSON
              </el-radio>
              <el-radio :label="EnumBodyType.formData">
                FormData
              </el-radio>
            </el-radio-group>
            <div v-show="apiData.bodyType === EnumBodyType.none" class="body-none">
              该接口不需要Body参数
            </div>
            <params-json-edit v-show="apiData.bodyType === EnumBodyType.json" :params-list="apiData.jsonParams" />
            <params-edit v-show="apiData.bodyType === EnumBodyType.formData" :params-list="apiData.formParams" style="margin-top: -15px;" />
          </el-tab-pane>
          <el-tab-pane name="header" class="tab-panel">
            <tab-header slot="label" :type="EnumParamType.header" :num="apiData.headerParams.length" />
            <params-edit :params-list="apiData.headerParams" :params-autocomplete="headerAutoList" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <h4>接口处理流程</h4>
      <flow-chart :api-data="apiData" />
      <el-button type="primary" :style="{ margin: '200px 0' }" @click="showSaveConfirm">
        保存更改
      </el-button>
    </el-form>
    <el-dialog :visible.sync="saveModal" title="填写版本信息">
      <el-form ref="saveform" :model="apiData" :rules="rulesSave">
        <el-alert title="接口更改总是会创建新的版本，而不会影响之前版本。" type="info" show-icon :closable="false" :style="{ marginBottom: '20px' }" />
        <div class="version-wrap">
          <el-form-item label="版本号" prop="version" style="width: 50%; margin-right: 20px;">
            <el-input
              v-model="apiData.version"
              placeholder="X.Y.Z"
            />
          </el-form-item>
          <el-form-item label="上个版本">
            {{ apiData.lastVersion }}
          </el-form-item>
        </div>
        <el-form-item label="版本说明" prop="versionMessage">
          <el-input
            v-model="apiData.versionMessage"
            placeholder="改动列表、注意事项、其它说明等"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveModal = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存更改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { Form } from 'element-ui';
import { headerAutoList, httpMethods, respFnKey, verifyKey, defaultRespFn } from '~/common/variables';
import { EnumStatus, EnumBodyType, EnumParamType } from '~/types/enum';
import { IApi } from '~/types/index';
export default vue.extend({
  name: 'ApiAddOrEdit',
  props: {
    apiData: {
      type: Object,
      default () {
        return {
          name: '',
          category: '',
          status: EnumStatus.regular,
          method: 'get',
          path: '',
          description: '',
          urlParams: [],
          bodyType: EnumBodyType.none,
          jsonParams: [],
          formParams: [],
          headerParams: [],
          flowchart: [{
            key: verifyKey,
            type: 'verify',
            base: true,
            advance: true
          }, {
            key: respFnKey,
            type: 'handler',
            custom: false,
            source: defaultRespFn,
            comment: ''
          }],
          version: '1.0.0',
          versionMessage: '',
          versionActive: true,
          versionThread: '',
          lastVersion: '无',
          createdBy: 'admin'
        };
      }
    } as PropOptions<IApi>
  },
  data () {
    return {
      apiDataCopyStr: JSON.stringify(this.apiData),
      EnumStatus,
      EnumBodyType,
      EnumParamType,
      httpMethods,
      rules: {
        name: [{
          required: true,
          message: '接口名称不能为空'
        }, {
          validator (_rule: any, _value: string, callback: any) {
            // TODO: 校验重复
            callback();
          },
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '接口路径不能为空'
        }, {
          pattern: /^\//,
          message: '接口路径必须以 / 开头'
        }, {
          validator (_rule: any, _value: string, callback: any) {
            // TODO: 校验重复
            callback();
          },
          trigger: 'blur'
        }]
      },
      rulesSave: {
        version: [{
          required: true,
          message: '版本号不能为空'
        }, {
          pattern: /^\d+\.\d+\.\d+$/,
          message: '版本号格式不正确，示例：1.5.2'
        }, {
          validator (_rule: any, _value: string, callback: any) {
            // TODO: 校验重复
            callback();
          },
          trigger: 'blur'
        }],
        versionMessage: [{
          required: true,
          message: '版本说明不能为空'
        }]
      },
      headerAutoList,
      currentParamTab: 'url' as 'url' | 'body' | 'header',
      saveModal: false
    };
  },
  computed: {
    isEdit (): boolean {
      return !!this.apiData._id;
    }
  },
  methods: {
    showSaveConfirm () {
      const form = this.$refs.form as Form;
      form.validate((valid) => {
        if (valid) {
          // 继续判断是否存在修改
          if (JSON.stringify(this.apiData) === this.apiDataCopyStr) {
            this.$alert('接口配置似乎没有发生更改，不需要保存~', '提示', {
              confirmButtonText: '好的'
            });
            return;
          }
          this.saveModal = true;
        } else {
          this.$message.error('表单信息不完整或格式错误');
        }
      });
    },
    saveData () {
      const saveform = this.$refs.saveform as Form;
      saveform.validate(async (valid) => {
        if (valid) {
          const { code, data } = await this.$axios[this.isEdit ? '$put' : '$post']('/api', this.apiData);
          if (code === 1 && data) {
            location.replace(`/api/${data._id}`);
          } else {
            this.$message(code.message || '出错了~');
          }
        } else {
          this.$message.error('表单信息不完整或格式错误');
        }
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
.version-wrap {
  display: flex;
}
</style>
<style>
.container .el-table th.is-leaf {
  line-height: initial;
}
</style>
