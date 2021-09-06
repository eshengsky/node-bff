<template>
  <div>
    <el-button v-if="isDebug && service.requestSource" class="ext-btn ext-request" type="primary" size="small" @click="showMeCode('查看request', service.requestSource)">查看request</el-button>
    <div class="service" @click="$emit('click')">
      <div class="service-no">
        <font-icon :icon="['fas', 'key']" /> {{ service.no }}
      </div>
      <div class="service-name">{{ service.name }}</div>
      <div class="service-path"><span class="service-method" :class="`method-${service.method}`">{{ service.method.toUpperCase() }}</span>{{ service.path }}</div>
    </div>
    <el-button v-if="isDebug && service.responseSource" class="ext-btn ext-response" type="primary" size="small" @click="showMeCode('查看response', service.responseSource)">查看response</el-button>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { IService } from '~/types';
export default vue.extend({
  name: 'ServicePanel',
  props: {
    service: {
      type: Object
    } as PropOptions<IService>,
    isDebug: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showMeCode (title: string, source: string) {
      this.$emit('show-me-code', {
        title,
        source
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.service {
  width: 250px;
  flex: none;
  border: 1px solid #333;
  border-radius: 4px;
  margin-right: 30px;
  cursor: pointer;
  background: #fff;
  .service-no,
  .service-name {
    border-bottom: 1px dashed #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    padding: 5px 10px;
  }
  .service-path {
    padding: 5px 10px;
    word-break: break-all;
    line-height: 1.4;
    .service-method {
      margin-right: 5px;
      font-weight: 600;
      color: #909399;
      &.method-get {
        color: #67c23a;
      }
      &.method-post {
        color: #e6a23c;
      }
      &.method-delete {
        color: #f56c6c;
      }
      &.method-put {
        color: #409eff;
      }
    }
  }
}
.ext-btn {
  margin-left: 78px;
  position: relative;
  &::after {
    content: "";
    display: block;
    height: 21px;
    width: 1px;
    background: #333;
    position: absolute;
    left: 50%;
  }
  &.ext-request {
    margin-bottom: 20px;
    &::after {
      bottom: -21px;
    }
  }
  &.ext-response {
    margin-top: 20px;
    &::after {
      top: -21px;
    }
  }
}
</style>
