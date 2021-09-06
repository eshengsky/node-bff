<template>
  <el-dialog
    title="设置表达式"
    :append-to-body="true"
    :visible="value"
    width="50%"
    @close="onClose"
  >
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="value = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import vue, { PropOptions } from 'vue';
export default vue.extend({
  name: 'TreeModal',
  props: {
    value: {
      type: Boolean,
      default: false
    } as PropOptions<Boolean>
  },
  methods: {
    onClose () {
      this.$emit('input', false);
    }
  }
});
</script>
