<template>
  <toastui-editor-viewer
    :initial-value="value"
    :options="mdViewerOptions"
  />
</template>

<script lang="ts">
import vue from 'vue';
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
export default vue.extend({
  name: 'MdViewer',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      mdViewerOptions: {
        plugins: [[codeSyntaxHighlight, { hljs }]]
      }
    };
  }
});
</script>
<style lang="scss">
.tui-editor-contents h5, .tui-editor-contents h6 {
  margin-bottom: 0;
}
</style>
