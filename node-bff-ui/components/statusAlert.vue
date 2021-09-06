<template>
  <div class="status-alert" :class="[[EnumStatus[type]], {pointer, checked}]">
    <template v-if="type === EnumStatus.deprecated">
      <i class="el-icon-remove" />
      <div>
        <h4>接口状态为已废弃</h4>
        <p>已废弃的接口可以正常访问，但会在响应首部添加<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Warning">警告信息</a>。</p>
      </div>
    </template>
    <template v-else-if="type === EnumStatus.deleted">
      <i class="el-icon-error" />
      <div>
        <h4>接口状态为已删除</h4>
        <p>已删除的接口被调用，将直接返回404。</p>
      </div>
    </template>
    <template v-else>
      <i class="el-icon-success" />
      <div>
        <h4>接口状态正常</h4>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { EnumStatus } from '~/types/enum';
export default vue.extend({
  name: 'StatusAlert',
  props: {
    type: {
      type: Number
    } as PropOptions<EnumStatus>,
    pointer: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      EnumStatus
    };
  }
});
</script>

<style lang="scss" scoped>
.status-alert {
  width: 100%;
  padding: 12px 16px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  color: #999;
  background: #efefef;
  transition: all .2s linear;
  &.regular.checked {
    background-color: #f0f9eb;
    color: #67c23a;
  }
  &.deleted.checked {
    background-color: #fef0f0;
    color: #f56c6c;
  }
  &.deprecated.checked {
    background-color: #fdf6ec;
    color: #e6a23c;
  }
  &.pointer {
    cursor: pointer;
  }
  i {
    font-size: 28px;
    width: 28px;
  }
  div {
    padding: 0 8px;
    h4 {
      font-size: 15px;
      font-weight: bold;
      margin: 0;
    }
    p {
      font-size: 13px;
      margin: 5px 0 0;
      a {
        color: inherit;
      }
    }
  }
}
</style>
