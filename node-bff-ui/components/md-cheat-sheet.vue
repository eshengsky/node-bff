<template>
  <div class="md-cheat-sheet">
    <!-- eslint-disable vue/no-v-html -->
    <el-table :data="tableData" border size="medium">
      <el-table-column prop="type" label="元素" width="200px" />
      <el-table-column label="Markdown语法">
        <template slot-scope="{ row }">
          <code v-html="row.markdown" />
        </template>
      </el-table-column>
      <el-table-column label="效果">
        <template slot-scope="{ row }">
          <md-viewer :value="row.markdown | clean" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import vue from 'vue';
export default vue.extend({
  name: 'MdCheatSheet',
  filters: {
    clean (val: string) {
      return val.replace(/<br>/g, '').replace(/&nbsp;/g, ' ');
    }
  },
  data () {
    return {
      tableData: [{
        type: '标题',
        markdown: `# 1级标题
<br>## 2级标题
<br>### 3级标题
<br>#### 4级标题
<br>##### 5级标题`
      }, {
        type: '加粗',
        markdown: '**加粗文本**'
      }, {
        type: '斜体',
        markdown: '*斜体文本*'
      }, {
        type: '删除',
        markdown: '~~已删除文本~~'
      }, {
        type: '引用',
        markdown: '> 引用内容'
      }, {
        type: '有序列表',
        markdown: `1. 第一项
<br>2. 第二项
<br>3. 第三项
<br>`
      }, {
        type: '无序列表',
        markdown: `* 第一项
<br>* 第二项
<br>* 第三项
<br>`
      }, {
        type: '任务列表',
        markdown: `* [x] 已完成
<br>* [ ] 未完成1
<br>* [ ] 未完成2`
      }, {
        type: '行内代码',
        markdown: '`code`'
      }, {
        type: '块级代码',
        markdown: `\`\`\`js
<br>function foo() {
<br>&nbsp;&nbsp;const name = "iBlog2";
<br>&nbsp;&nbsp;console.log(name);
<br>}
<br>\`\`\``
      }, {
        type: '分隔线',
        markdown: '---'
      }, {
        type: '链接',
        markdown: '[链接地址](https://skysun.name)'
      }, {
        type: '图片',
        markdown: '![logo](/logo.png)'
      }, {
        type: '表格',
        markdown: `| 框架 | 类型 |
<br>| --- | --- |
<br>| Vue.js | 前端 |
<br>| Express.js | 后端 |`
      }]
    };
  }
});
</script>
<style lang="scss">
.md-cheat-sheet {
  img {
    width: 100px;
  }
}
</style>
