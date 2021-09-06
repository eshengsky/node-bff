<template>
  <el-dialog
    title="高级设置"
    :visible="value"
    width="30%"
    @close="close"
  >
    <advanced-string :param-obj="paramObj" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'AdvancedDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    param: {
      type: Object
    }
  },
  data () {
    return {
      paramObj: {}
    };
  },
  methods: {
    close () {
      this.$emit('input');
    }
  },
  watch: {
    value (val: Boolean) {
      if (val) {
        this.paramObj = JSON.parse(JSON.stringify(this.param));
      }
    }
  }
});
</script>
