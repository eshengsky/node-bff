<template>
  <div>
    <div class="flowchart-wrap">
      <div class="start">Start</div>
      <template v-for="(item) in apiData.flowchart">
        <div v-if="item.type === 'verify'" :key="item.key" class="verify">参数校验</div>
        <template v-else-if="item.type === 'handler'">
          <el-button v-if="item.beforeContext" :key="'bc' + item.key" type="primary" size="small" @click="showMeCode('查看context', item.beforeContext)">查看context</el-button>
          <el-popover
            :key="item.key"
            :class="{ muted: !isDisplayHandler(item) }"
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <div slot="reference" class="handler" :class="{ 'resp-handler': item.key === respFnKey }" @click="showHandler(item)" />
          </el-popover>
          <el-button v-if="item.afterContext && item.key !== respFnKey" :key="'ac' + item.key" type="primary" size="small" @click="showMeCode('查看context', item.afterContext)">查看context</el-button>
        </template>
        <div v-else-if="item.type === 'services'" :key="item.key" class="service-group" :class="{ muted: !isDisplayServiceGroup(item) }">
          <div class="service-wrap">
            <span class="group-name">{{ getTitle(item, apiData) }}</span>
            <service-panel
              v-for="service in item.services"
              :key="service.key"
              :service="service"
              :is-debug="true"
              @click="showService(service, item.key)"
              @show-me-code="showMeCode($event.title, $event.source)"
            />
          </div>
          <div class="service-line" />
        </div>
      </template>
      <div class="end">End</div>
    </div>
    <handler-view
      v-model="handlerVisible"
      :api-data="apiData"
      :handler="editingHandler"
    />
    <service-view
      v-model="serviceVisible"
      :api-data="apiData"
      :service="editingService"
    />
    <json-view
      v-model="showCodeModal"
      :title="currentCode.title"
      :source="currentCode.source"
    />
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { IHandler, IApi, IService, IServiceGroup } from '~/types/index';
import { EnumBodyType } from '~/types/enum';
import { respFnKey, defaultJsonFn } from '~/common/variables';
import { getHandlerServicesName } from '~/common/utils';
export default vue.extend({
  name: 'FlowView',
  props: {
    apiData: {
      type: Object
    } as PropOptions<IApi>,
    isDebug: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EnumBodyType,
      respFnKey,
      handlerVisible: false,
      editingHandler: {} as IHandler,
      serviceVisible: false,
      editingService: {} as IService,
      editingServiceGroupKey: 0,
      editingBtnIndex: -1,
      showCodeModal: false,
      currentCode: {},
      monaco: null,
      editorOptions: {
        language: 'typescript',
        fontSize: 14,
        glyphMargin: true,
        scrollBeyondLastLine: false
      }
    };
  },
  mounted () {
    this.monaco = require('monaco-editor');
  },
  methods: {
    isDisplayHandler (item: IHandler) {
      if (!this.isDebug) {
        return true;
      }
      return !!item.beforeContext;
    },
    isDisplayServiceGroup (item: IServiceGroup) {
      if (!this.isDebug) {
        return true;
      }
      return item.services.some(t => t.requestSource);
    },
    showHandler (handler: IHandler) {
      this.editingHandler = handler;
      this.handlerVisible = true;
    },
    showService (service?: IService, groupKey: number = 0, btnIndex: number = -1) {
      this.editingService = service || {
        key: 0,
        no: '',
        name: '',
        method: 'get',
        path: '',
        pathParams: [],
        urlParams: [],
        bodyType: EnumBodyType.none,
        jsonSource: defaultJsonFn,
        jsonSourceCompiled: '',
        formParams: [],
        headerParams: [],
        comment: ''
      };
      this.editingServiceGroupKey = groupKey;
      this.serviceVisible = true;
      this.editingBtnIndex = btnIndex;
    },
    getTitle (item: IHandler | IServiceGroup) {
      return getHandlerServicesName(item, this.apiData);
    },
    showMeCode (title: string, source: string) {
      this.currentCode = {
        title,
        source
      };
      this.showCodeModal = true;
    }
  }
});
</script>

<style lang="scss" scoped>
$line: 40px;
$muted: #bbb;
.flowchart-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-width: 1px;
  border-color: rgb(255, 255, 255);
  border-style: solid;
  background-color: rgb(255, 255, 255);
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=);
  background-position: -1px -1px;
  border: 1px solid #EBEEF5;
  padding: 40px;
  > * {
    position: relative;
    margin-bottom: $line;
    &::after {
      content: "";
      display: block;
      height: $line;
      width: 1px;
      background: #333;
      position: absolute;
      left: 50%;
      bottom: -$line - 1;
    }
    &:last-child {
      margin: 0;
      &::after {
        display: none;
      }
    }
  }
  .start,
  .end {
    display: flex;
    width: 120px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border: 1px solid #333;
    border-radius: 30px;
    background: #fff;
  }
  .verify {
    width: 120px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #333;
    border-radius: 2px;
    background: #fff;
    cursor: pointer;
  }
  .handler {
    width: 30px;
    height: 30px;
    border: 1px solid #333;
    border-radius: 50%;
    background: #fff;
    position: relative;
    cursor: pointer;
    &.resp-handler::before {
      position: absolute;
      content: "";
      width: 22px;
      height: 22px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #333;
      border-radius: 50%;
      background: #fff;
    }
  }
  .service-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    max-width: 85%;
    .service-wrap {
      display: flex;
      align-items: flex-start;
      border: 1px dashed #333;
      border-radius: 6px;
      padding: 30px 0 30px 30px;
      width: 100%;
      overflow-x: auto;
      .group-name {
        position: absolute;
        left: 14px;
        top: -9px;
        padding: 1px 2px;
        font-size: 12px;
        background: #fff;
      }
      .append-div {
        width: 30px;
        flex: none;
      }
    }
    .service-line {
      width: 1px;
      height: 40px;
      background: #333;
    }
  }
}
.api-drawer-body {
  padding: 15px;
  height: 100vh;
  overflow: auto;
  h3 {
    font-weight: normal;
    margin: 0 0 10px;
    i {
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .tab-panel {
    margin: -16px;
    .switch-body {
      margin: 15px 0 0 15px;
    }
  }
}
</style>
<style lang="scss">
$muted: #bbb;
.flowchart-wrap {
  .muted {
    .handler {
      border-color: $muted;
      &::before {
        border-color: $muted !important;
      }
    }
    &.service-group {
      .service-wrap {
        border-color: $muted;
        color: $muted;
        .service {
          border-color: $muted;
          .service-no,
          .service-name {
            border-color: $muted;
          }
          .service-method {
            opacity: .6;
          }
        }
      }
      .service-line {
        background: $muted;
      }
    }
    &::after {
      background: $muted;
    }
  }
}
</style>
