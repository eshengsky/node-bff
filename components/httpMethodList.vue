<template>
  <el-select slot="prepend" :value="value" popper-class="method-list" style="width: 120px;" @input="$emit('input', $event)">
    <el-option v-for="(item) in httpMethods" :key="item.method" :label="item.method.toUpperCase()" :value="item.method">
      <p>{{ item.method.toUpperCase() }}</p>
      <small>{{ item.desc }}</small>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { httpMethods } from '~/common/variables';
export default vue.extend({
  props: {
    value: {
      type: String
    } as PropOptions<string>
  },
  data () {
    return {
      httpMethods
    };
  }
});
</script>
<style lang="scss" scoped>
.method-list {
  li {
    height: auto;
    line-height: normal;
    padding: 10px 20px;
    border-bottom: 1px solid #efefef;
    &:last-child {
      border: 0;
    }
    p {
      margin: 0 0 2px;
    }
    small {
      color: #999;
      font-size: 13px;
    }
  }
}
</style>
