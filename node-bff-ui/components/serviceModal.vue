<template>
  <el-drawer
    ref="drawer"
    size="40%"
    :with-header="false"
    :visible="value"
    :before-close="beforeClose"
    @close="close"
    @closed="onClosedHandler"
  >
    <div v-if="value" class="drawer-container">
      <div class="drawer-header">{{ isEdit ? '编辑' : '新增' }}接口调用</div>
      <div class="drawer-body">
        <el-form label-position="top">
          <el-form-item
            label="接口ID"
            prop="no"
          >
            <el-input v-model="serviceClone.no" class="no-input" placeholder="该接口的唯一标识，如：api1" />
            <small v-if="serviceClone.no" class="no-tip"><i class="el-icon-warning-outline" /> 在后续流程中，你可以通过 <code>context.${{ serviceClone.no }}</code> 访问到该接口的响应对象</small>
          </el-form-item>
          <el-form-item
            label="接口名称"
            prop="name"
          >
            <el-input v-model="serviceClone.name" placeholder="接口的名称，如：获取商品详情" />
          </el-form-item>
          <el-form-item
            prop="path"
            label="接口路径"
          >
            <el-input
              v-model="serviceClone.path"
              placeholder="支持路径参数，如 /goods/:id"
            >
              <el-select slot="prepend" v-model="serviceClone.method" style="width: 120px;">
                <el-option v-for="(item) in httpMethods" :key="item.method" :value="item.method" :label="item.method.toUpperCase()" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item
            label="接口入参"
          >
            <el-tabs v-model="currentTab" type="border-card">
              <el-tab-pane name="url" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.url" :num="serviceClone.urlParams.length" />
                <service-params :params-list="serviceClone.urlParams" />
              </el-tab-pane>
              <el-tab-pane name="path" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.path" :num="serviceClone.pathParams.length" />
                <service-path-params :path="serviceClone.path" :params-list="serviceClone.pathParams" />
              </el-tab-pane>
              <el-tab-pane name="body" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.body" :num="serviceClone.bodyType === EnumBodyType.none ? 0 : (serviceClone.bodyType === EnumBodyType.json ? -1 : serviceClone.formParams.length)" />
                <div v-if="serviceClone.method === 'get'" class="alert-wrap">
                  <el-alert type="warning" title="警告：GET请求设置Body参数可能无效！" :closable="false" />
                </div>
                <el-radio-group v-model="serviceClone.bodyType" class="switch-body" @change="onBodyTypeChange">
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
                <div v-show="serviceClone.bodyType === EnumBodyType.none" class="body-none">
                  该接口不需要Body参数
                </div>
                <code-editor
                  v-show="serviceClone.bodyType === EnumBodyType.json"
                  ref="editor"
                  language="typescript"
                  :value="serviceClone.jsonSource"
                  class="editor-container"
                  @editorDidMount="editorDidMount"
                />
                <service-params v-show="serviceClone.bodyType === EnumBodyType.formData" :params-list="serviceClone.formParams" style="margin-top: -15px;" />
              </el-tab-pane>
              <el-tab-pane name="header" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.header" :num="serviceClone.headerParams.length" />
                <service-params ref="headerEdit" :params-list="serviceClone.headerParams" :params-autocomplete="headerAutoList" />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
          <el-form-item label="备注" prop="comment">
            <el-input
              v-model="serviceClone.comment"
              type="textarea"
              :rows="2"
              placeholder="接口的备注信息"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-footer">
        <div>
          <el-button v-if="isEdit" type="danger" icon="el-icon-delete" @click="del">删除</el-button>
        </div>
        <div>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { headerAutoList, httpMethods } from '~/common/variables';
import { generateDefinition } from '~/common/utils';
import { IApi, IService } from '~/types';
import { EnumBodyType, EnumParamType } from '~/types/enum';
export default vue.extend({
  name: 'ServiceModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    apiData: {
      type: Object
    } as PropOptions<IApi>,
    service: {
      type: Object
    } as PropOptions<IService>
  },
  data () {
    return {
      currentTab: 'url',
      serviceOrigin: {} as IService,
      serviceClone: {} as IService,
      httpMethods,
      EnumBodyType,
      EnumParamType,
      headerAutoList,
      codeDisposeEvent: null
    };
  },
  computed: {
    isEdit () {
      return this.service.key !== 0;
    }
  },
  methods: {
    addTypeDefinition () {
      const libSource = generateDefinition(this.apiData, 0);
      this.codeDisposeEvent = (this.$refs.editor as any).monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource);
    },
    editorDidMount (editor: any) {
      const model = editor.getModel();
      const doUndo = () => Promise.resolve().then(() => {
        model.undo();
      });

      // 监听代码改动
      model.onDidChangeContent(({ isUndoing }: { isUndoing: boolean }) => {
        if (!isUndoing) {
          const value: string = model.getValue();
          const matched = value.match(/^export default function \(context: IContext\): IJson {[\r\n][\s\S]*}$/m);
          if (matched && matched[0] === value) {
            // 代码符合正则，且匹配项就是完整的代码，说明代码外层没有被修改
            this.serviceClone.jsonSource = value;
          } else {
            console.log('=== Undo ===', matched, value);
            doUndo();
          }
        }
      });
    },
    confirm () {
      // 检查是否存在语法错误
      const markers = (this.$refs.editor as any).getMarkers();
      const errors: any[] = [];
      if (markers && markers.length) {
        // 只关注警告和错误的marker
        markers.forEach((marker: any) => {
          if (marker.severity === 4 || marker.severity === 8) {
            errors.push(markers);
          }
        });
      }
      if (errors.length) {
        console.log('错误列表：', errors);
        this.$message.error('代码存在错误或警告，请检查并修改！');
        return;
      }
      this.serviceOrigin = this.serviceClone;
      (this.$refs.drawer as any).closeDrawer();
      this.$emit('updateService', this.serviceClone);
    },
    cancel () {
      (this.$refs.drawer as any).closeDrawer();
    },
    del () {
      this.$emit('delService', this.serviceClone);
    },
    /**
     * 关闭之前的回调
     * 检查是否做出过修改
     * 如果存在修改则弹窗提示
     * 否则直接关闭
     */
    beforeClose (done: Function) {
      if (JSON.stringify(this.serviceOrigin) === JSON.stringify(this.serviceClone)) {
        done();
      } else {
        this.$confirm('检测到未保存的内容，是否要保存修改？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '保存',
          cancelButtonText: '放弃修改',
          type: 'warning'
        }).then(() => {
          this.confirm();
        }).catch((action) => {
          if (action === 'cancel') {
            done();
          }
        });
      }
    },
    close () {
      this.$emit('input', false);
    },
    onClosedHandler () {
      // 移除类型定义，下次打开弹窗时再动态生成
      if (this.codeDisposeEvent) {
        (this.codeDisposeEvent as any).dispose();
      }
      this.currentTab = 'url';
    },
    onBodyTypeChange (val: EnumBodyType) {
      // 自动修改header
      (this.$refs.headerEdit as any).addContentType(val);
    }
  },
  watch: {
    value (val: Boolean) {
      if (val) {
        this.serviceOrigin = JSON.parse(JSON.stringify(this.service));
        this.serviceClone = JSON.parse(JSON.stringify(this.service));
        setTimeout(() => {
          // 抽屉弹出后，才加载ts类型定义
          this.addTypeDefinition();
        });
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.no-tip {
  color: #666;
  display: block;
  line-height: 12px;
  margin-top: 10px;
  i {
    color: #777;
    font-size: 15px;
    position: relative;
    top: 1px;
    left: 1px;
  }
  code {
    background: #efefef;
    border-radius: 4px;
    padding: 2px 4px;
  }
}
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .drawer-header {
    height: 60px;
    flex: none;
    font-size: 18px;
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 15px;
    .editor-container {
      height: 300px;
    }
  }
  .drawer-footer {
    flex: none;
    display: flex;
    justify-content: space-between;
    padding: 15px;
    box-shadow: 0 0 5px 0 #dcdfe6;
    z-index: 1;
  }
}
.alert-wrap {
  padding: 15px 15px 0;
  line-height: normal;
}
</style>
