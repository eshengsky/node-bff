<template>
  <el-drawer
    ref="drawer"
    size="60%"
    :with-header="false"
    :visible="value"
    :append-to-body="true"
    @close="close"
    @closed="onClosedHandler"
  >
    <div v-if="value" class="drawer-container">
      <div class="drawer-header">
        {{ serviceClone.name }}
      </div>
      <div class="drawer-body">
        <div class="base-wrap">
          <div class="path-wrap">
            <el-tag class="method-tag" type="info">
              {{ serviceClone.no }}
              <i v-title="`在后续流程中，你可以通过 <code>context.$${ serviceClone.no }</code> 访问到该接口的响应对象`" class="el-icon-warning-outline" />
            </el-tag>
            <el-tag class="method-tag" :type="getMethodType(serviceClone.method)">{{ serviceClone.method.toUpperCase() }}</el-tag>{{ serviceClone.path }}
          </div>
          <div v-if="serviceClone.comment" class="comment">备注：{{ serviceClone.comment }}</div>
        </div>
        <div v-if="serviceClone.urlParams.length" class="common-block">
          <h2>URL参数</h2>
          <service-params-view :params-list="serviceClone.urlParams" />
        </div>
        <div v-if="serviceClone.pathParams.length" class="common-block">
          <h2>Path参数</h2>
          <service-params-view :params-list="serviceClone.pathParams" />
        </div>
        <div v-if="serviceClone.bodyType === EnumBodyType.json || (serviceClone.bodyType === EnumBodyType.formData && serviceClone.formParams.length)" class="common-block">
          <h2>
            Body参数<span>{{ serviceClone.bodyType === EnumBodyType.json ? 'JSON' : 'FormData' }}</span>
          </h2>
          <div v-if="serviceClone.method === 'get'" class="alert-wrap">
            <el-alert type="warning" title="警告：GET请求设置Body参数可能无效！" :closable="false" />
          </div>
          <template v-if="serviceClone.bodyType === EnumBodyType.json">
            <service-params-json-view :params-list="serviceClone.jsonParams" />
          </template>
          <template v-else-if="serviceClone.bodyType === EnumBodyType.formData">
            <service-params-view :params-list="serviceClone.formParams" />
          </template>
        </div>
        <div v-if="serviceClone.headerParams.length" class="common-block">
          <h2>Header参数</h2>
          <service-params-view :params-list="serviceClone.headerParams" />
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
  methods: {
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
    addTypeDefinition () {
      const libSource = generateDefinition(this.apiData, 0);
      this.codeDisposeEvent = (this.$refs.editor as any).monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource);
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
    .base-wrap {
      padding-bottom: 10px;
      .path-wrap {
        font-size: 18px;
        display: flex;
        align-items: center;
        .method-tag {
          min-width: 60px;
          text-align: center;
          height: 28px;
          line-height: 28px;
          font-weight: 600;
          margin-right: 10px;
        }
      }
      .comment {
        margin-top: 10px;
        font-size: 13px;
        color: #666;
      }
    }
    .common-block {
      margin-bottom: 20px;
      h2 {
        font-size: 16px;
        font-weight: 400;
        border-left: 3px solid rgba(35, 149, 241, .6);
        padding-left: 10px;
        span {
          font-size: 12px;
          line-height: 12px;
          background: #999;
          color: #fff;
          border-radius: 4px;
          padding: 1px 4px;
          position: relative;
          top: -2px;
          margin-left: 4px;
        }
      }
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
  margin-bottom: 10px;
  line-height: normal;
}
</style>
