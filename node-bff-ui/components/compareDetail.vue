<template>
  <div>
    <code-editor
      ref="editor"
      :diff-editor="true"
      :original="left"
      :value="right"
      language="json"
      class="editor-container"
    />
  </div>
</template>

<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'CompareDetail',
  props: {
    left: {
      type: String
    },
    right: {
      type: String
    }
  }
});
</script>
<style lang="scss" scoped>
.editor-container {
  height: 300px;
}
</style>
