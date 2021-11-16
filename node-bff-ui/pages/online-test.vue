<template>
  <div class="online-test">
    <template v-if="api">
      <div class="input-wrap">
        <a class="input-api" @click="goApiDetail">
          <el-tag class="method-tag" :type="getMethodType(api.method)">{{ api.method.toUpperCase() }}</el-tag><span class="path">{{ api.path }}</span>
        </a>
        <div class="btn-wrap">
          <el-button v-if="sending" type="primary" disabled>
            处理中...
          </el-button>
          <el-button v-else type="primary" @click="send">
            <font-icon :icon="['fas', 'paper-plane']" /> 发送
          </el-button>
        </div>
      </div>
      <splitpanes horizontal class="default-theme">
        <pane size="50" min-size="20" max-size="80" style="padding-top: 0;">
          <div class="params-wrap">
            <div class="tools-wrap">
              <el-link :underline="false" type="primary" style="margin-right: 10px;" @click="reset">
                <font-icon :icon="['fas', 'flask']" /> 重新选择接口
              </el-link>
              <el-link :underline="false" type="success" @click="saveTest">
                <font-icon :icon="['fas', 'download']" /> 导出测试数据
              </el-link>
            </div>
            <el-tabs v-model="currentTab">
              <el-tab-pane name="url" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.url" :num="params.urlParams.length" />
                <service-params :params-list="params.urlParams" hide-type />
              </el-tab-pane>
              <el-tab-pane name="body" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.body" :num="params.bodyType === EnumBodyType.none ? 0 : (params.bodyType === EnumBodyType.json ? -1 : params.formParams.length)" />
                <div v-if="api.method === 'get'" class="alert-wrap">
                  <el-alert type="warning" title="警告：GET请求设置Body参数可能无效！" :closable="false" />
                </div>
                <el-radio-group v-model="params.bodyType" class="switch-body" @change="onBodyTypeChange">
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
                <div v-show="params.bodyType === EnumBodyType.none" class="body-none">
                  该接口不需要Body参数
                </div>
                <code-editor
                  v-show="params.bodyType === EnumBodyType.json"
                  ref="editor"
                  language="json"
                  :value="params.jsonSource"
                  class="editor-container"
                />
                <service-params v-show="params.bodyType === EnumBodyType.formData" :params-list="params.formParams" hide-type />
              </el-tab-pane>
              <el-tab-pane name="header" class="tab-panel">
                <tab-header slot="label" :type="EnumParamType.header" :num="params.headerParams.length" />
                <service-params ref="headerEdit" :params-list="params.headerParams" :params-autocomplete="headerAutoList" hide-type />
              </el-tab-pane>
            </el-tabs>
          </div>
        </pane>
        <pane v-loading="sending" size="50" min-size="20" max-size="80" style="padding: 0;">
          <splitpanes>
            <pane>
              <div class="resp-wrap">
                <el-tabs value="body">
                  <el-tab-pane name="body" label="Body">
                    <code-editor
                      ref="editorRes"
                      :value="respBody"
                      :readonly="true"
                      language="json"
                      class="editor-container"
                    />
                  </el-tab-pane>
                  <el-tab-pane name="headers" label="响应头">
                    <el-table :data="respHeaders" border size="medium">
                      <el-table-column prop="key" label="Key" width="300" />
                      <el-table-column prop="value" label="Value" />
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
                <div v-if="response" class="time-wrap">
                  <span>状态码: <i :class="(response.status >= 200 && response.status < 400) ? 'success' : 'error'">{{ response.status }} {{ response.statusText }}</i></span>
                  <span>请求耗时: <i :class="requestCostTime.originTime > 1000 ? 'error' : 'success'">{{ requestCostTime.time }} {{ requestCostTime.unit }}</i></span>
                  <span>服务端耗时: <i :class="serverCostTime.originTime > 1000 ? 'error' : 'success'">{{ serverCostTime.time }} {{ serverCostTime.unit }}</i></span>
                </div>
              </div>
            </pane>
            <pane>
              <div class="debug-wrap">
                <el-tabs value="flow">
                  <el-tab-pane name="flow" label="处理流程">
                    <flow-view v-if="debugApiData" :api-data="debugApiData" :is-debug="true" />
                  </el-tab-pane>
                  <el-tab-pane name="console" label="Console" class="console-wrap">
                    <div slot="label">
                      Console<i v-if="logs.length" class="badge-dot" />
                    </div>
                    <ul class="console-wrap">
                      <li v-for="(log, index) in logs" :key="index" :class="`log-${log.level}`">
                        <font-icon v-if="log.level === 'error'" :icon="['fas', 'times-circle']" fixed-width />
                        <font-icon v-else-if="log.level === 'warn'" :icon="['fas', 'exclamation-triangle']" fixed-width />
                        <span class="timestamp">
                          {{ log.time | formatTime }}
                        </span>
                        <span v-for="(message, idx) in log.messages" :key="idx" class="log-part">
                          <template v-if="message.isError">
                            <span>{{ message.message }}</span>
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <div v-if="message.stack" v-html="message.stack.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')" />
                          </template>
                          <vue-json-pretty
                            v-else-if="typeof message === 'object'"
                            :data="message"
                            :deep="1"
                            :show-length="true"
                            :show-double-quotes="false"
                            :highlight-selected-node="false"
                          />
                          <template v-else>{{ message }}</template>
                        </span>
                      </li>
                    </ul>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </pane>
          </splitpanes>
        </pane>
      </splitpanes>
    </template>
    <div v-else class="landing-wrap">
      <div class="landing-panel" style="margin-right: 30px;" @click="searchVisible = true">
        <font-icon class="icon" :icon="['fas', 'flask']" />
        <div>选择一个接口进行测试</div>
      </div>
      <div class="landing-panel" @click="chooseFile" @dragover="dragover" @drop="dragFile">
        <font-icon class="icon" :icon="['fas', 'upload']" />
        <div>导入已有的测试数据</div>
        <input id="inputFile" type="file" style="display: none;" @change="loadFile($event.target.files[0])">
      </div>
    </div>
    <global-search v-model="searchVisible" @select-item="selectItem" />
  </div>
</template>

<script lang="ts">
import vue from 'vue';
import dayjs from 'dayjs';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { headerAutoList } from '~/common/variables';
import { IApi, IServiceParam } from '~/types';
import { EnumBodyType, EnumParamType } from '~/types/enum';
import { formatCostTime } from '~/common/utils';
export default vue.extend({
  name: 'OnlineTest',
  components: {
    Splitpanes,
    Pane
  },
  props: {
    debuggerApi: Object,
    default: {}
  },
  data () {
    return {
      searchVisible: false,
      api: null as IApi | null,
      params: {
        urlParams: [] as IServiceParam[],
        bodyType: EnumBodyType.none,
        jsonSource: '{}',
        formParams: [] as IServiceParam[],
        headerParams: [] as IServiceParam[]
      },
      currentTab: 'url',
      EnumBodyType,
      EnumParamType,
      headerAutoList,
      response: null,
      logs: [],
      costTime: 0,
      sending: false,
      debugApiData: null
    };
  },
  computed: {
    respBody (): string {
      if (!this.response) {
        return '';
      }
      if (!(this.response as any).data) {
        return '';
      }
      try {
        return JSON.stringify((this.response as any).data, null, 4);
      } catch (err) {
        return '';
      }
    },
    respHeaders () {
      if (!this.response) {
        return [];
      }
      const result: any = [];
      const headers = (this.response as any).headers;
      Object.keys(headers).forEach((key) => {
        result.push({
          key,
          value: headers[key]
        });
      });
      return result;
    },
    requestCostTime (): any {
      if (!this.response) {
        return {};
      }
      return formatCostTime(this.costTime);
    },
    serverCostTime (): any {
      if (!this.response) {
        return {};
      }
      const headers = (this.response as any).headers;
      const time = headers['x-api-time'];
      if (time) {
        return formatCostTime(time);
      }
      return {};
    }
  },
  async mounted () {
    const thread = this.$route.query.thread as string | null;
    if (this?.debuggerApi?.name) {
      this.api = JSON.parse(JSON.stringify(this.debuggerApi));
      this.initParams();
    } else if (thread) {
      try {
        const { data } = await this.getApiByThread(thread);
        this.api = data;
        this.initParams();
      } catch (err) {
        console.error(err);
      }
    }
  },
  watch: {
    debuggerApi: {
      deep: true,
      handler () {
        this.api = JSON.parse(JSON.stringify(this.debuggerApi));
      }
    }
  },
  methods: {
    getApiByThread (thread: string) {
      return this.$axios.$get('/latestApi', {
        params: {
          thread
        }
      });
    },
    initParams () {
      if (this.api) {
        this.params.urlParams = [];
        this.api.urlParams.forEach((param) => {
          this.params.urlParams.push({
            key: 0,
            paramName: param.paramName,
            paramValue: '',
            valType: 'fixed'
          });
        });
        this.params.bodyType = this.api.bodyType;
        if (this.params.bodyType === EnumBodyType.json) {
          this.params.jsonSource = '{}';
        } else if (this.params.bodyType === EnumBodyType.formData) {
          this.params.formParams = [];
          this.api.formParams.forEach((param) => {
            this.params.formParams.push({
              key: 0,
              paramName: param.paramName,
              paramValue: '',
              valType: 'fixed'
            });
          });
        }
        this.params.headerParams = [];
        this.api.headerParams.forEach((param) => {
          this.params.headerParams.push({
            key: 0,
            paramName: param.paramName,
            paramValue: '',
            valType: 'fixed'
          });
        });
      }
    },
    selectItem (item: IApi) {
      this.api = item;
      this.clearCurrent();
      this.initParams();
      this.$router.replace(`/online-test?thread=${item.versionThread}`);
    },
    getMethodType (method: string) {
      switch (method) {
        case 'get':
          return 'success';
        case 'post':
          return 'warning';
        case 'delete':
          return 'danger';
        case 'put':
          return '';
        default:
          return 'info';
      }
    },
    onBodyTypeChange (val: EnumBodyType) {
      // 自动修改header
      (this.$refs.headerEdit as any).addContentType(val);
    },

    buildParamsObj (params: IServiceParam[], toLowerCase = false) {
      const obj: any = {};
      if (params.length) {
        params.forEach((param) => {
          if (param.paramName) {
            let paramName = param.paramName;
            if (toLowerCase) {
              paramName = param.paramName.toLowerCase();
            }
            obj[paramName] = param.paramValue || '';
          }
        });
      }
      return obj;
    },
    reset () {
      this.api = null;
      this.$router.replace('/online-test');
    },
    saveFile (fileName: string, urlFile: string) {
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none');
      document.body.appendChild(a);
      a.href = urlFile;
      a.download = fileName;
      a.click();
      a.remove();
    },
    saveTest () {
      if (this.params.bodyType === EnumBodyType.json) {
        this.params.jsonSource = (this.$refs.editor as any).getEditor().getValue();
      }
      const data = JSON.stringify({
        thread: this.api?.versionThread,
        params: this.params
      });
      const blobData = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blobData);
      this.saveFile(`ApiTest - ${this.api?.method.toUpperCase()} ${this.api?.path}`, url);
    },
    async loadFile (file: File) {
      const loading = this.$loading({});
      const text = await file.text();
      this.clearCurrent();
      try {
        const testData = JSON.parse(text);
        const { thread, params } = testData;
        try {
          const data = await this.getApiByThread(thread);
          if (data.code === 1) {
            // 根据id成功获取到了数据
            this.api = data.data;
            this.params = params;
            this.$router.replace(`/online-test?thread=${this.api?.versionThread}`);
          } else {
            this.$message.error(data.message);
          }
        } catch (err) {
          this.$message.error('找不到该接口！');
        }
      } catch (err) {
        console.error(err);
        this.$message.error('导入的文件格式不正确！');
      }
      loading.close();
    },
    chooseFile () {
      (document.getElementById('inputFile') as HTMLInputElement).click();
    },
    dragover (event: DragEvent) {
      event.stopPropagation();
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    },
    dragFile (event: DragEvent) {
      event.stopPropagation();
      event.preventDefault();
      if (event.dataTransfer) {
        this.loadFile(event.dataTransfer.files[0]);
      }
    },
    clearCurrent () {
      this.costTime = 0;
      this.response = null;
      this.debugApiData = null;
      this.logs = [];
    },

    async send () {
      this.clearCurrent();

      // 当页面没有刷新时，测试中的接口可能已经发生了变更，所以每次都要重新获取api
      // 但获取api不计算响应时长
      try {
        if (this.$route.query.thread) {
          const { data } = await this.getApiByThread(this.$route.query.thread as string);
          this.api = data;
        }
      } catch (err) {
        console.error(err);
        this.$message.error('获取接口详情失败！');
        return;
      }
      if (!this.api) {
        this.$message.error('获取接口详情失败！');
        return;
      }
      this.sending = true;

      // 过滤特定编辑器实例的markers
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
        this.$message.error('JSON格式不正确，请检查并修改！');
        this.sending = false;
        return;
      }

      const reqObj: any = {
        path: this.api.path,
        query: this.buildParamsObj(this.params.urlParams),
        headers: this.buildParamsObj(this.params.headerParams, true)
      };
      if (this.params.bodyType === EnumBodyType.json) {
        reqObj.body = JSON.parse((this.$refs.editor as any).getEditor().getValue());
      } else if (this.params.bodyType === EnumBodyType.formData) {
        reqObj.body = this.buildParamsObj(this.params.formParams);
      } else {
        reqObj.body = null;
      }

      const start = performance.now();
      let response;
      let logs;
      let debugApiData;
      try {
        const data = await this.$axios.$post('/api-test', {
          reqObj,
          apiData: this.api
        });
        response = data.response;
        logs = data.exts.logs;
        debugApiData = data.exts.apiData;
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data) {
          response = err.response.data.response;
          logs = err.response.data.exts.logs;
          debugApiData = err.response.data.exts.apiData;
        }
      }
      this.costTime = performance.now() - start;
      this.response = response || null;
      this.logs = logs || [];
      this.debugApiData = debugApiData;
      this.sending = false;
    },
    goApiDetail (event: Event) {
      if (this?.api?._id) {
        window.open(`/api/${this.api._id}`);
      }
      event.preventDefault();
    }
  },
  filters: {
    formatTime (time: string) {
      return dayjs(time).format('HH:mm:ss.SSS');
    }
  }
});
</script>

<style lang="scss" scoped>
.online-test {
  margin: -20px;
  height: calc(100vh - 60px);
  .input-wrap {
    padding: 20px 20px 15px;
    display: flex;
    height: 75px;
    .input-api {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 5px;
      border: 1px solid #dcdfe6;
      border-radius: 6px;
      cursor: pointer;
      font-size: 20px;
      text-decoration: none;
      &:hover {
        border-color: #c0c4cc;
      }
      .placeholder {
        color: #999;
        font-size: 15px;
        line-height: 28px;
        padding-left: 10px;
      }
      .method-tag {
        min-width: 60px;
        text-align: center;
        height: 28px;
        line-height: 28px;
        font-weight: 600;
        margin-right: 10px;
      }
      .path {
        font-size: 16px;
        color: #333;
      }
    }
    .btn-wrap {
      flex: none;
      margin-left: 10px;
      button {
        width: 88px;
      }
    }
  }
  .splitpanes__pane {
    padding: 0 20px 10px;
    overflow-y: auto;
  }
  .params-wrap {
    position: relative;
    .tools-wrap {
      position: absolute;
      top: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      z-index: 1;
    }
    .alert-wrap {
      margin-bottom: 15px;
    }
    .switch-body {
      margin-bottom: 15px;
    }
    .body-none {
      line-height: 40px;
      padding: 20px 0 10px;
      text-align: center;
      color: #999;
    }
    .editor-container {
      height: 300px;
    }
  }
  .time-wrap {
    position: absolute;
    top: 0;
    right: 0;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    color: #333;
    span {
      margin-left: 10px;
      i {
        font-style: normal;
      }
      i.success {
        color: #67C23A;
      }
      i.error {
        color: #F56C6C;
        font-weight: 500;
      }
    }
  }
  .landing-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    .landing-panel {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 400px;
      height: 250px;
      border: 2px dashed #666;
      border-radius: 8px;
      cursor: pointer;
      color: #666;
      font-size: 18px;
      opacity: .6;
      &:hover {
        opacity: .9;
      }
    }
    .icon {
      font-size: 28px;
      margin-bottom: 30px;
    }
  }
  .badge-dot {
    display: inline-block;
    position: relative;
    left: 4px;
    top: 0;
    background-color: #409eff;
    color: #fff;
    padding: 0;
    height: 8px;
    width: 8px;
    border-radius: 50%;
  }
  .console-wrap {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      position: relative;
      border-bottom: 1px solid #eee;
      padding: 8px 0;
      .timestamp {
        color: #777;
        margin-right: 3px;
      }
      .log-part {
        margin-right: 6px;
      }
      &.log-error {
        // background-color: #fef0f0;
        color: #f56c6c;
      }
      &.log-warn {
        // background-color: #fdf6ec;
        color: #e6a23c;
        svg {
          position: relative;
          top: -1px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.splitpanes.default-theme {
  height: calc(100% - 75px);
  .splitpanes__pane {
    background: #fff;
  }
}
.online-test {
  .action-bar {
    margin: 0 0 15px 0 !important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff !important;
  }
  .el-table {
    border-radius: 4px;
    overflow: hidden;
  }
  .params-wrap {
    .editor-container {
      height: calc(100% - 30px) !important;
    }
  }
  .params-wrap,
  .resp-wrap,
  .debug-wrap {
    position: relative;
    height: 100%;
    .el-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      .el-tabs__content {
        flex: 1;
        .el-tab-pane {
          overflow: auto;
          height: 100%;
          .editor-container {
            height: 100%;
          }
        }
      }
    }
  }
}
.default-theme.splitpanes--horizontal>.splitpanes__splitter, .default-theme .splitpanes--horizontal>.splitpanes__splitter {
  height: 8px;
  border-bottom: 1px solid #eee;
}
.default-theme.splitpanes--vertical>.splitpanes__splitter, .default-theme .splitpanes--vertical>.splitpanes__splitter {
  width: 8px;
  border-right: 1px solid #eee;
}
</style>
