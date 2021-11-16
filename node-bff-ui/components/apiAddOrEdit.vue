<template>
  <div class="api-add-edit">
    <el-form v-show="!saveModal" ref="form" :model="apiData" :rules="rules" label-width="100px">
      <status-alert v-if="apiData.status !== EnumStatus.regular" :type="apiData.status" checked />
      <div class="common-block">
        <h2>基本信息</h2>
        <div>
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
                <el-option key="default" value="default" label="默认分类" />
                <el-option v-for="item in categories" :key="item._id" :value="item._id" :label="item.name" />
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
      </div>
      <div class="common-block">
        <h2>参数定义</h2>
        <div>
          <el-tabs v-model="currentParamTab" type="border-card">
            <el-tab-pane name="url" class="tab-panel">
              <tab-header slot="label" :type="EnumParamType.url" :num="apiData.urlParams.length" />
              <params-edit :params-list="apiData.urlParams" />
            </el-tab-pane>
            <el-tab-pane name="body" class="tab-panel">
              <tab-header slot="label" :type="EnumParamType.body" :num="apiData.bodyType === EnumBodyType.none ? 0 : (apiData.bodyType === EnumBodyType.json ? -1 : apiData.formParams.length)" />
              <div v-if="apiData.method === 'get'" class="alert-wrap">
                <el-alert type="warning" title="警告：GET请求设置Body参数可能无效！" :closable="false" />
              </div>
              <el-radio-group v-model="apiData.bodyType" class="switch-body" @change="onBodyTypeChange">
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
              <params-edit
                ref="headerEdit"
                :params-list="apiData.headerParams"
                :params-autocomplete="headerAutoList"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="common-block">
        <h2>接口处理流程</h2>
        <flow-chart :api-data="apiData" />
      </div>
      <div class="action-bar">
        <el-button plain @click="goBack">返回</el-button>
        <el-button type="primary" :style="{ margin: '200px 10px' }" @click="showSaveConfirm">
          保存更改
        </el-button>
        <el-button type="warning" :style="{ margin: '200px 0' }" :loading="debugLoading" @click="onDebug">
          立即调试
        </el-button>
      </div>
    </el-form>
    <div v-show="saveModal">
      <el-tabs v-model="saveModalTab">
        <el-tab-pane label="新的版本" name="version">
          <el-form ref="saveform" label-position="top" :model="apiData" :rules="rulesSave">
            <el-alert title="接口更改总是会创建新的版本，而不会影响之前版本。" type="info" show-icon :closable="false" :style="{ marginBottom: '20px' }" />
            <div class="version-wrap">
              <el-form-item label="版本号" prop="version" style="width: 200px; margin-right: 20px;">
                <el-input
                  ref="inputVersion"
                  v-model="apiData.version"
                  placeholder="X.Y.Z"
                />
              </el-form-item>
              <el-form-item label="上个版本">
                {{ apiData.lastVersion }}
              </el-form-item>
            </div>
            <el-form-item label="发布说明" prop="versionMessage">
              <md-editor v-model="apiData.versionMessage" placeholder="改动列表、注意事项、其它说明等" />
            </el-form-item>
            <el-form-item>
              <el-button @click="saveModal = false">返回</el-button>
              <el-button type="primary" :loading="saving" @click="saveData">确认发布</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="改动明细" name="compare">
          <compare-detail :left="apiDataCopyStr" :right="JSON.stringify(apiData, null, 2)" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-drawer
      :with-header="false"
      :visible.sync="showDebuggerDrawer"
      :append-to-body="true"
      size="90%">
      <div style="padding: 20px;">
        <onlineTest :debuggerApi="apiDataClone"></onlineTest>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { Form } from 'element-ui';
import onlineTest from '../pages/online-test.vue';
import { headerAutoList, httpMethods, respFnKey, verifyKey } from '~/common/variables';
import { EnumStatus, EnumBodyType, EnumParamType } from '~/types/enum';
import { IApi } from '~/types/index';
export default vue.extend({
  name: 'ApiAddOrEdit',
  components: {
    onlineTest
  },
  props: {
    apiData: {
      type: Object,
      default () {
        return {
          name: '',
          category: 'default',
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
            source: '',
            comment: ''
          }],
          version: '1.0.0',
          versionMessage: '',
          versionActive: true,
          versionThread: '',
          lastVersion: '无',
          createdBy: ''
        };
      }
    } as PropOptions<IApi>
  },
  data () {
    return {
      apiDataCopyStr: JSON.stringify(this.apiData, null, 2),
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
          message: '版本说明不能为空',
          trigger: 'blur'
        }]
      },
      headerAutoList,
      currentParamTab: 'url' as 'url' | 'body' | 'header',
      saveModal: false,
      categories: [],
      saveModalTab: 'version',
      saving: false,
      debugLoading: false,
      showDebuggerDrawer: false,
      apiDataClone: {}
    };
  },
  computed: {
    isEdit (): boolean {
      return !!this.apiData._id;
    }
  },
  async created () {
    try {
      const data = await this.$axios.$get('/categories');
      this.categories = data.data;
    } catch (err) {
      this.categories = [];
      console.error('接口请求异常！');
    }
  },
  methods: {
    onBodyTypeChange (val: EnumBodyType) {
      (this.$refs.headerEdit as any).addContentType(val);
    },
    showSaveConfirm () {
      const form = this.$refs.form as Form;
      form.validate((valid) => {
        if (valid) {
          // 继续判断是否存在修改
          if (JSON.stringify(this.apiData, null, 2) === this.apiDataCopyStr) {
            this.$alert('没有检测到更改，无需保存~', '提示', {
              confirmButtonText: '好的'
            });
            return;
          }
          this.saveModal = true;
          this.$nextTick(() => {
            (this.$refs.inputVersion as HTMLInputElement).focus();
          });
        } else {
          this.$message.error('表单信息不完整或格式错误');
        }
      });
    },
    onMdBlur () {
      const content = (this.$refs.mdEditor as any).invoke('getMarkdown');
      this.apiData.versionMessage = content;
    },
    onDebug () {
      const form = this.$refs.form as Form;
      form.validate(async (valid) => {
        if (valid) {
          this.debugLoading = true;
          const { code, data, message } = await this.$axios.$post('/getDebugApi', this.apiData);
          if (code === 1 && data) {
            this.apiDataClone = data;
            this.showDebuggerDrawer = true;
          } else {
            this.$message.error(message || '出错了~');
          }
          this.debugLoading = false;
        } else {
          this.$message.error('表单信息不完整或格式错误');
        }
      });
    },
    saveData () {
      const saveform = this.$refs.saveform as Form;
      saveform.validate(async (valid) => {
        if (valid) {
          this.saving = true;
          // 更新当前操作人员
          this.apiData.createdBy = (this.$store.$auth.user as any).name;

          const { code, data, message } = await this.$axios[this.isEdit ? '$put' : '$post']('/api', this.apiData);
          if (code === 1 && data) {
            // 小细节：保存成功后，跳转新页面之前，需要更新下apiDataCopyStr
            // 否则，会弹窗提示内容未保存
            this.apiDataCopyStr = JSON.stringify(this.apiData, null, 2);
            location.replace(`/api/${data._id}`);
          } else {
            this.$message.error(message || '出错了~');
          }
          this.saving = false;
        } else {
          this.$message.error('表单信息不完整或格式错误');
        }
      });
    },
    goBack () {
      history.back();
    }
  }
});
</script>

<style lang="scss" scoped>
.api-add-edit {
  position: relative;
  padding-bottom: 30px;
}
.version-wrap {
  display: flex;
}
.alert-wrap {
  padding: 15px 15px 0;
}
.common-block {
  position: relative;
  margin-bottom: 30px;
  h2 {
    font-size: 18px;
    font-weight: 400;
    border-left: 3px solid #2395f1;
    padding-left: 10px;
  }
}
.action-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  position: fixed;
  left: 200px;
  right: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
<style>
.api-add-edit .el-table th.is-leaf {
  line-height: initial;
}
</style>
