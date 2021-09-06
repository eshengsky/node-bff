<template>
  <div>
    <toastui-editor
      ref="editor"
      :initial-value="value"
      preview-style="tab"
      :options="mdEditorOptions"
      @change="onEditorChange"
    />
    <div class="comment-btn-wrap">
      <a v-title="'打开Markdown语法速查'" @click="mcsShow = true">
        <font-icon :icon="['fab', 'markdown']" style="font-size: 14px" />
        <span>支持Markdown语法</span>
      </a>
    </div>
    <el-dialog :visible.sync="mcsShow" title="Markdown 语法速查">
      <md-cheat-sheet />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import vue from 'vue';
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
export default vue.extend({
  name: 'MdEditor',
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String
    }
  },
  data () {
    return {
      mcsShow: false
    };
  },
  computed: {
    mdEditorOptions () {
      return {
        language: 'zh-CN',
        useCommandShortcut: false,
        usageStatistics: false,
        hideModeSwitch: true,
        placeholder: this.placeholder,
        plugins: [[codeSyntaxHighlight, { hljs }]]
      };
    }
  },
  methods: {
    onEditorChange () {
      const content = (this.$refs.editor as any).invoke('getMarkdown');
      this.$emit('change', content);
    }
  }
});
</script>
<style lang="scss" scoped>
.comment-btn-wrap {
  font-size: 12px;
  color: #666;
  padding-left: 20px;
  border: 1px solid #e5e5e5;
  border-top: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  a {
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style lang="scss">
.te-markdown-tab-section .te-tab {
  display: flex;
  button {
    height: 32px;
  }
}
</style>
