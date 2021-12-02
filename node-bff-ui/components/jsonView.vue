<template>
  <el-drawer
    ref="drawer"
    size="40%"
    :with-header="false"
    :visible="value"
    :append-to-body="true"
    @close="close"
  >
    <div class="drawer-container">
      <div class="drawer-header">{{ title }}</div>
      <div class="drawer-body">
        <code-editor
          ref="editor"
          :value="source"
          language="json"
          class="editor-container"
          :readonly="true"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'HandlerModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    source: {
      type: String
    },
    title: {
      type: String
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
    display: flex;
    flex-direction: column;
    .editor-container {
      flex: 1;
      margin-bottom: 15px;
    }
  }
  .drawer-footer {
    text-align: right;
    margin: 0 15px 15px 0;
  }
}
</style>
