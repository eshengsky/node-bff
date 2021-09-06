<template>
  <el-drawer
    size="30%"
    :with-header="false"
    :visible="value"
    :destroy-on-close="true"
    @close="close"
  >
    <div class="notes-wrap">
      <div class="drawer-header">发布说明</div>
      <div class="drawer-body">
        <md-viewer :value="message" />
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'VersionNotes',
  props: {
    message: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('input', false);
    }
  }
});
</script>
<style lang="scss" scoped>
.notes-wrap {
  height: 100vh;
  .drawer-header {
    height: 60px;
    font-size: 18px;
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .drawer-body {
    height: calc(100vh - 60px);
    overflow-y: auto;
    padding: 0 20px 20px;
  }
}
</style>
