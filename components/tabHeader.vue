<template>
  <div class="badge-wrap">
    <span>{{ names[EnumParamType[type]] }}</span>
    <template v-if="num > 0">
      <i class="badge">{{ num }}</i>
    </template>
    <template v-else-if="num === -1">
      <i class="badge dot" />
    </template>
  </div>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
import { EnumParamType } from '~/types/enum';
export default vue.extend({
  name: 'TabHeader',
  props: {
    type: {
      type: Number
    } as PropOptions<EnumParamType>,
    num: {
      type: Number,
      default: 0
    } as PropOptions<Number>
  },
  data () {
    return {
      EnumParamType,
      names: {
        url: 'URL参数',
        body: 'Body参数',
        path: 'Path参数',
        header: 'Header参数'
      }
    };
  }
});
</script>
<style lang="scss" scoped>
.badge-wrap {
  display: flex;
  align-items: center;
  .badge {
    position: relative;
    top: -8px;
    background-color: #409eff;
    border-radius: 30px;
    color: #fff;
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    padding: 0 5px;
    text-align: center;
  }
  .dot {
    padding: 0;
    height: 8px;
    width: 8px;
    border-radius: 50%;
  }
}
</style>
