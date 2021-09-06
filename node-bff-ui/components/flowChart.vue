<template>
  <div>
    <div class="flowchart-wrap">
      <div class="start">Start</div>
      <template v-for="(item, index) in apiData.flowchart">
        <div v-if="item.type === 'verify'" :key="item.key" class="verify">参数校验</div>
        <template v-else-if="item.type === 'handler'">
          <el-button :key="`btn-${item.key}`" plain type="primary" icon="el-icon-plus" @click="showService(null, 0, index)">接口调用</el-button>
          <el-popover
            v-if="item.key === respFnKey"
            :key="item.key"
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <div slot="reference" class="handler resp-handler" @click="showHandler(item)" />
          </el-popover>
          <el-popover
            v-else
            :key="item.key"
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <div slot="reference" class="handler" @click="showHandler(item)" />
          </el-popover>
        </template>
        <div v-else-if="item.type === 'services'" :key="item.key" class="service-group">
          <div class="service-wrap">
            <span class="group-name">{{ getTitle(item, apiData) }}</span>
            <service-panel v-for="service in item.services" :key="service.key" :service="service" @click="showService(service, item.key)" />
            <el-button :key="`btn-${item.key}`" plain type="primary" icon="el-icon-plus" @click="showService(null, item.key)">接口调用</el-button>
            <div class="append-div">&nbsp;</div>
          </div>
          <div class="service-line" />
        </div>
      </template>
      <div class="end">End</div>
    </div>
    <handler-modal
      v-model="handlerVisible"
      :api-data="apiData"
      :handler="editingHandler"
      @updateHandler="updateHandler"
    />
    <service-modal
      v-model="serviceVisible"
      :api-data="apiData"
      :service="editingService"
      @updateService="updateService"
      @delService="delService"
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
  name: 'FlowChart',
  props: {
    apiData: {
      type: Object
    } as PropOptions<IApi>
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
      editingBtnIndex: -1
    };
  },
  methods: {
    showHandler (handler: IHandler) {
      this.editingHandler = handler;
      this.handlerVisible = true;
    },
    updateHandler (handler: IHandler) {
      const index = this.apiData.flowchart.findIndex(t => t.key === handler.key);
      if (index >= 0) {
        this.apiData.flowchart.splice(index, 1, handler);
      }
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
    updateService (service: IService) {
      if (service.key === 0) {
        // 新增接口
        service.key = Date.now();
        if (this.editingServiceGroupKey === 0) {
          // 新增接口组，总是添加一个handler+一个接口组
          const key = Date.now();
          const serviceGroup: IServiceGroup = {
            key,
            type: 'services',
            services: [service]
          };
          const handler = {
            key: key + 1,
            type: 'handler',
            custom: false,
            source: '',
            comment: ''
          } as IHandler;
          this.apiData.flowchart.splice(this.editingBtnIndex, 0, handler, serviceGroup);
        } else {
          // 在已有的接口组内新增一个接口
          const serviceGroup = this.apiData.flowchart.find(t => t.key === this.editingServiceGroupKey) as IServiceGroup;
          if (serviceGroup) {
            serviceGroup.services.push(service);
          }
        }
      } else {
        // 更新
        const serviceGroup = this.apiData.flowchart.find(t => t.key === this.editingServiceGroupKey) as IServiceGroup;
        if (serviceGroup) {
          const idx = serviceGroup.services.findIndex(t => t.key === service.key);
          if (idx >= 0) {
            serviceGroup.services.splice(idx, 1, service);
          }
        }
      }
    },
    delService (service: IService) {
      const groupIndex = this.apiData.flowchart.findIndex(t => t.key === this.editingServiceGroupKey);
      const serviceGroup = this.apiData.flowchart[groupIndex] as IServiceGroup;
      if (!serviceGroup) {
        return;
      }
      // eslint-disable-next-line vue/no-parsing-error
      let msg = '确定要删除该接口吗？';
      if (serviceGroup.services.length === 1) {
        // 如果接口组只剩最后一个接口了，给出更强的提示
        // eslint-disable-next-line vue/no-parsing-error
        msg = '<strong>注意：所在的接口组和它前面的一般处理函数也会被一起删除！</strong><br>确定要删除该接口吗？';
      }
      this.$confirm(msg, '操作确认', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (serviceGroup.services.length > 1) {
          const idx = serviceGroup.services.findIndex(t => t.key === service.key);
          if (idx >= 0) {
            serviceGroup.services.splice(idx, 1);
          }
        } else {
          this.apiData.flowchart.splice(groupIndex - 1, 2);
        }
        this.serviceVisible = false;
      }).catch(() => {});
    },
    getTitle (item: IHandler | IServiceGroup) {
      return getHandlerServicesName(item, this.apiData);
    }
  }
});
</script>

<style lang="scss" scoped>
$line: 40px;
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
